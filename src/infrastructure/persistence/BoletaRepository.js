const db = require('../../config/db');
const Boleta = require('../../domain/entities/Boleta');
const Precio = require('../../domain/valueObjects/Precio');
const TipoVenta = require('../../domain/valueObjects/TipoVenta');

/**
 * Repository: BoletaRepository
 * Persistencia de Agregados Boleta
 */
class BoletaRepository {
  /**
   * Guardar boleta (crear o actualizar)
   */
  async guardar(boleta) {
    boleta.validar();

    const query = `
      INSERT INTO boleta (tipo_venta, metodo_pago, total, estado_boleta, id_cliente_boleta, id_empleado_boleta, id_locale, id_carrito, fecha_emision)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING id_boleta, tipo_venta, metodo_pago, total, estado_boleta, id_cliente_boleta, id_empleado_boleta, id_locale, id_carrito
    `;

    const { rows } = await db.query(query, [
      boleta.tipoVenta.toString(),
      boleta.metodoPago,
      boleta.total.monto,
      boleta.estado,
      boleta.idCliente,
      boleta.idEmpleado,
      boleta.idLocal,
      boleta.idCarrito
    ]);

    return this._mapearABoleta(rows[0]);
  }

  /**
   * Obtener boleta por ID
   */
  async obtenerPorId(idBoleta) {
    const query = `
      SELECT id_boleta, tipo_venta, metodo_pago, total, estado_boleta, 
             id_cliente_boleta, id_empleado_boleta, id_locale, id_carrito, fecha_emision
      FROM boleta
      WHERE id_boleta = $1
    `;

    const { rows } = await db.query(query, [idBoleta]);

    if (rows.length === 0) {
      return null;
    }

    return this._mapearABoleta(rows[0]);
  }

  /**
   * Obtener boletas del cliente
   */
  async obtenerPorCliente(idCliente) {
    const query = `
      SELECT id_boleta, tipo_venta, metodo_pago, total, estado_boleta,
             id_cliente_boleta, id_empleado_boleta, id_locale, id_carrito, fecha_emision
      FROM boleta
      WHERE id_cliente_boleta = $1 AND tipo_venta = 'online'
      ORDER BY fecha_emision DESC
    `;

    const { rows } = await db.query(query, [idCliente]);
    return rows.map(row => this._mapearABoleta(row));
  }

  /**
   * Obtener boletas del empleado
   */
  async obtenerPorEmpleado(idEmpleado) {
    const query = `
      SELECT id_boleta, tipo_venta, metodo_pago, total, estado_boleta,
             id_cliente_boleta, id_empleado_boleta, id_locale, id_carrito, fecha_emision
      FROM boleta
      WHERE id_empleado_boleta = $1 AND tipo_venta = 'fisica'
      ORDER BY fecha_emision DESC
    `;

    const { rows } = await db.query(query, [idEmpleado]);
    return rows.map(row => this._mapearABoleta(row));
  }

  /**
   * Obtener boletas pagadas
   */
  async obtenerPagadas(fechaInicio = null, fechaFin = null) {
    let query = `
      SELECT id_boleta, tipo_venta, metodo_pago, total, estado_boleta,
             id_cliente_boleta, id_empleado_boleta, id_locale, id_carrito, fecha_emision
      FROM boleta
      WHERE estado_boleta = 'pagado'
    `;

    const params = [];

    if (fechaInicio && fechaFin) {
      query += ` AND fecha_emision >= $${params.length + 1} AND fecha_emision <= $${params.length + 2}`;
      params.push(fechaInicio, fechaFin);
    }

    query += ` ORDER BY fecha_emision DESC`;

    const { rows } = await db.query(query, params);
    return rows.map(row => this._mapearABoleta(row));
  }

  /**
   * Actualizar estado de boleta
   */
  async actualizarEstado(idBoleta, nuevoEstado) {
    const query = `
      UPDATE boleta
      SET estado_boleta = $1
      WHERE id_boleta = $2
      RETURNING id_boleta, estado_boleta
    `;

    const { rows } = await db.query(query, [nuevoEstado, idBoleta]);
    return rows[0] || null;
  }

  /**
   * Obtener total de ventas
   */
  async obtenerTotalVentas(fechaInicio = null, fechaFin = null) {
    let query = `
      SELECT SUM(total) as total_ventas
      FROM boleta
      WHERE estado_boleta = 'pagado'
    `;

    const params = [];

    if (fechaInicio && fechaFin) {
      query += ` AND fecha_emision >= $${params.length + 1} AND fecha_emision <= $${params.length + 2}`;
      params.push(fechaInicio, fechaFin);
    }

    const { rows } = await db.query(query, params);
    return rows[0]?.total_ventas || 0;
  }

  /**
   * Mapear fila de BD a Entidad Boleta
   */
  _mapearABoleta(fila) {
    const boleta = new Boleta(
      fila.id_boleta,
      new TipoVenta(fila.tipo_venta),
      new Precio(fila.total),
      fila.metodo_pago,
      fila.id_cliente_boleta,
      fila.id_empleado_boleta,
      fila.id_locale,
      fila.id_carrito
    );

    boleta.estado = fila.estado_boleta;
    boleta.fechaEmision = fila.fecha_emision;

    return boleta;
  }
}

module.exports = BoletaRepository;
