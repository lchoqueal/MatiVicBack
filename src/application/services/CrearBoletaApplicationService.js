const Boleta = require('../../domain/entities/Boleta');
const TipoVenta = require('../../domain/valueObjects/TipoVenta');
const Precio = require('../../domain/valueObjects/Precio');
const db = require('../../config/db');

/**
 * Application Service: CrearBoletaApplicationService
 * Orquesta creación de boleta con transacción y concurrencia
 * CRÍTICO: Usa FOR UPDATE para evitar race conditions en stock
 */
class CrearBoletaApplicationService {
  constructor(boletaRepository, carritoRepository, productoRepository, socketIOEmitter) {
    this.boletaRepository = boletaRepository;
    this.carritoRepository = carritoRepository;
    this.productoRepository = productoRepository;
    this.socketIOEmitter = socketIOEmitter;
  }

  /**
   * Ejecutar creación de boleta con transacción
   */
  async ejecutar(comando) {
    const { 
      idCarrito, 
      tipoVenta, 
      metodoPago, 
      idCliente, 
      idEmpleado, 
      idLocal 
    } = comando;

    const client = await db.connect();

    try {
      await client.query('BEGIN');

      // 1. Obtener carrito
      const queryCarrito = 'SELECT * FROM carrito WHERE id_carrito = $1';
      const resCarrito = await client.query(queryCarrito, [idCarrito]);
      
      if (resCarrito.rows.length === 0) {
        throw new Error('Carrito no encontrado');
      }

      // 2. Obtener items del carrito
      const queryItems = `
        SELECT dc.id_producto, dc.cantidad, p.precio_unit
        FROM detalle_carrito dc
        JOIN producto p ON dc.id_producto = p.id_producto
        WHERE dc.id_carrito = $1
      `;
      const resItems = await client.query(queryItems, [idCarrito]);

      if (resItems.rows.length === 0) {
        throw new Error('Carrito vacío');
      }

      // 3. LOCK cada producto con FOR UPDATE
      let totalBoleta = 0;
      const detalleItems = [];

      for (const item of resItems.rows) {
        // Lock con FOR UPDATE
        const queryLock = `
          SELECT id_producto, stock FROM producto
          WHERE id_producto = $1
          FOR UPDATE
        `;
        const resLock = await client.query(queryLock, [item.id_producto]);
        const productoLocked = resLock.rows[0];

        // Validar stock nuevamente
        if (productoLocked.stock < item.cantidad) {
          throw new Error(`Stock insuficiente para producto ${item.id_producto}`);
        }

        // Decrementar stock
        const queryDecremento = `
          UPDATE producto
          SET stock = stock - $1
          WHERE id_producto = $2
        `;
        await client.query(queryDecremento, [item.cantidad, item.id_producto]);

        // Acumular total
        const subtotal = item.precio_unit * item.cantidad;
        totalBoleta += subtotal;

        detalleItems.push({
          idProducto: item.id_producto,
          cantidad: item.cantidad,
          precio: item.precio_unit
        });
      }

      // 4. Crear boleta
      const queryBoleta = `
        INSERT INTO boleta (tipo_venta, metodo_pago, total, estado_boleta, id_cliente_boleta, id_empleado_boleta, id_locale, id_carrito, fecha_emision)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        RETURNING id_boleta, tipo_venta, metodo_pago, total, estado_boleta, id_cliente_boleta, id_empleado_boleta, id_locale, id_carrito
      `;

      const resBoleta = await client.query(queryBoleta, [
        tipoVenta,
        metodoPago,
        totalBoleta,
        'pagado',
        idCliente,
        idEmpleado,
        idLocal,
        idCarrito
      ]);

      const boletaCreada = resBoleta.rows[0];

      // 5. Crear detalle_boleta
      for (const item of detalleItems) {
        const queryDetalle = `
          INSERT INTO detalle_boleta (id_boleta, id_producto, cantidad)
          VALUES ($1, $2, $3)
        `;
        await client.query(queryDetalle, [boletaCreada.id_boleta, item.idProducto, item.cantidad]);
      }

      // 6. Marcar carrito como completado
      const queryCarritoCompleto = `
        UPDATE carrito
        SET estado = 'completado'
        WHERE id_carrito = $1
      `;
      await client.query(queryCarritoCompleto, [idCarrito]);

      // COMMIT transacción
      await client.query('COMMIT');

      // 7. Emitir eventos (después de COMMIT exitoso)
      if (this.socketIOEmitter) {
        const boleta = {
          id: boletaCreada.id_boleta,
          tipo: boletaCreada.tipo_venta,
          total: boletaCreada.total,
          timestamp: new Date()
        };
        
        this.socketIOEmitter.emitirBoletaCreada(boleta);

        // Emitir actualización de stock para cada producto
        for (const item of detalleItems) {
          const producto = await this.productoRepository.obtenerPorId(item.idProducto);
          this.socketIOEmitter.emitirStockActualizado(producto);
        }
      }

      return {
        idBoleta: boletaCreada.id_boleta,
        total: boletaCreada.total,
        estado: boletaCreada.estado_boleta,
        mensaje: 'Boleta creada exitosamente'
      };

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = CrearBoletaApplicationService;
