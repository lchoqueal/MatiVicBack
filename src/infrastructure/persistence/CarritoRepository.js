const db = require('../../config/db');
const Carrito = require('../../domain/entities/Carrito');
const Precio = require('../../domain/valueObjects/Precio');

/**
 * Repository: CarritoRepository
 * Persistencia de Agregados Carrito
 */
class CarritoRepository {
  /**
   * Crear nuevo carrito
   */
  async crear(tipoCarrito, idCliente = null, idEmpleado = null) {
    const query = `
      INSERT INTO carrito (tipo_carrito, id_cliente, estado)
      VALUES ($1, $2, 'activo')
      RETURNING id_carrito
    `;

    const { rows } = await db.query(query, [tipoCarrito, idCliente]);
    return rows[0].id_carrito;
  }

  /**
   * Guardar carrito (con items)
   */
  async guardar(carrito) {
    carrito.validar();

    // Obtener carrito existente o crear uno nuevo
    let idCarrito = carrito.id;

    if (!idCarrito) {
      idCarrito = await this.crear(carrito.tipoCarrito, carrito.idCliente, carrito.idEmpleado);
      carrito.id = idCarrito;
    }

    // Limpiar items anteriores
    await db.query('DELETE FROM detalle_carrito WHERE id_carrito = $1', [idCarrito]);

    // Insertar items nuevos
    for (const item of carrito.items) {
      const queryItem = `
        INSERT INTO detalle_carrito (id_carrito, id_producto, cantidad)
        VALUES ($1, $2, $3)
      `;

      await db.query(queryItem, [idCarrito, item.idProducto, item.cantidad]);
    }

    return carrito;
  }

  /**
   * Obtener carrito por ID
   */
  async obtenerPorId(idCarrito) {
    const queryCarrito = `
      SELECT id_carrito, tipo_carrito, id_cliente, estado
      FROM carrito
      WHERE id_carrito = $1
    `;

    const { rows: rowsCarrito } = await db.query(queryCarrito, [idCarrito]);

    if (rowsCarrito.length === 0) {
      return null;
    }

    const carritoData = rowsCarrito[0];

    // Obtener items
    const queryItems = `
      SELECT dc.id_detalle_carrito, dc.id_producto, dc.cantidad,
             p.nombre, p.precio_unit
      FROM detalle_carrito dc
      JOIN producto p ON dc.id_producto = p.id_producto
      WHERE dc.id_carrito = $1
    `;

    const { rows: rowsItems } = await db.query(queryItems, [idCarrito]);

    const carrito = new Carrito(
      carritoData.id_carrito,
      carritoData.tipo_carrito,
      carritoData.id_cliente,
      null
    );

    for (const item of rowsItems) {
      carrito.items.push({
        idProducto: item.id_producto,
        nombre: item.nombre,
        precio: new Precio(item.precio_unit),
        cantidad: item.cantidad,
        subtotal: new Precio(item.precio_unit * item.cantidad)
      });
    }

    carrito.recalcularTotal();
    return carrito;
  }

  /**
   * Obtener carrito activo del cliente
   */
  async obtenerCarritoActivoPorCliente(idCliente) {
    const query = `
      SELECT id_carrito, tipo_carrito, id_cliente, estado
      FROM carrito
      WHERE id_cliente = $1 AND tipo_carrito = 'cliente' AND estado = 'activo'
      LIMIT 1
    `;

    const { rows } = await db.query(query, [idCliente]);

    if (rows.length === 0) {
      return null;
    }

    return await this.obtenerPorId(rows[0].id_carrito);
  }

  /**
   * Obtener carrito activo del vendedor
   */
  async obtenerCarritoActivoPorEmpleado(idEmpleado) {
    const query = `
      SELECT id_carrito, tipo_carrito, id_cliente, estado
      FROM carrito
      WHERE id_cliente = $1 AND tipo_carrito = 'venta_fisica' AND estado = 'activo'
      LIMIT 1
    `;

    const { rows } = await db.query(query, [idEmpleado]);

    if (rows.length === 0) {
      return null;
    }

    return await this.obtenerPorId(rows[0].id_carrito);
  }

  /**
   * Agregar item al carrito
   */
  async agregarItem(idCarrito, idProducto, cantidad) {
    const queryVerificar = `
      SELECT id_detalle_carrito, cantidad FROM detalle_carrito
      WHERE id_carrito = $1 AND id_producto = $2
    `;

    const { rows } = await db.query(queryVerificar, [idCarrito, idProducto]);

    if (rows.length > 0) {
      // Actualizar cantidad
      const queryActualizar = `
        UPDATE detalle_carrito
        SET cantidad = cantidad + $1
        WHERE id_carrito = $2 AND id_producto = $3
      `;

      await db.query(queryActualizar, [cantidad, idCarrito, idProducto]);
    } else {
      // Insertar nuevo item
      const queryInsertar = `
        INSERT INTO detalle_carrito (id_carrito, id_producto, cantidad)
        VALUES ($1, $2, $3)
      `;

      await db.query(queryInsertar, [idCarrito, idProducto, cantidad]);
    }
  }

  /**
   * Eliminar item del carrito
   */
  async eliminarItem(idCarrito, idProducto) {
    const query = `
      DELETE FROM detalle_carrito
      WHERE id_carrito = $1 AND id_producto = $2
    `;

    await db.query(query, [idCarrito, idProducto]);
  }

  /**
   * Vaciar carrito
   */
  async vaciar(idCarrito) {
    const query = `
      DELETE FROM detalle_carrito
      WHERE id_carrito = $1
    `;

    await db.query(query, [idCarrito]);
  }

  /**
   * Eliminar carrito
   */
  async eliminar(idCarrito) {
    const queryItems = `DELETE FROM detalle_carrito WHERE id_carrito = $1`;
    const queryCarrito = `DELETE FROM carrito WHERE id_carrito = $1`;

    await db.query(queryItems, [idCarrito]);
    await db.query(queryCarrito, [idCarrito]);
  }
}

module.exports = CarritoRepository;
