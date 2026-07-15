const db = require('../../../shared/config/db');
const Producto = require('../domain/entities/Producto');
const Stock = require('../domain/valueObjects/Stock');
const Precio = require('../../../shared/domain/valueObjects/Precio');

/**
 * Repository: ProductoRepository
 * Persistencia de Agregados Producto
 */
class ProductoRepository {
  /**
   * Guardar producto (crear o actualizar)
   */
  async guardar(producto) {
    producto.validar();

    const query = `
      INSERT INTO producto (id_producto, nombre, stock, min_stock, precio_unit, estado, descripcion, imagen_url, id_categoria)
      VALUES (COALESCE($1, nextval('producto_id_producto_seq')), $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (id_producto) DO UPDATE SET
        nombre = EXCLUDED.nombre,
        stock = EXCLUDED.stock,
        min_stock = EXCLUDED.min_stock,
        precio_unit = EXCLUDED.precio_unit,
        estado = EXCLUDED.estado,
        descripcion = EXCLUDED.descripcion,
        imagen_url = EXCLUDED.imagen_url,
        id_categoria = EXCLUDED.id_categoria
      RETURNING id_producto, nombre, stock, min_stock, precio_unit, estado, descripcion, imagen_url, id_categoria
    `;

    const { rows } = await db.query(query, [
      producto.id, // ID del producto (null si es nuevo)
      producto.nombre,
      producto.stock.cantidad,
      producto.minStock,
      producto.precio.monto,
      producto.estado,
      producto.descripcion,
      producto.imagenUrl,
      producto.idCategoria
    ]);

    return this._mapearAProducto(rows[0]);
  }

  /**
   * Obtener producto por ID
   */
  async obtenerPorId(id) {
    const query = `
      SELECT p.id_producto, p.nombre, p.stock, p.min_stock, p.precio_unit, p.estado, p.descripcion, p.imagen_url, p.id_categoria, c.nombre as categoria
      FROM producto p
      LEFT JOIN categoria c ON p.id_categoria = c.id_categoria
      WHERE p.id_producto = $1
    `;

    const { rows } = await db.query(query, [id]);
    return rows[0] ? this._mapearAProducto(rows[0]) : null;
  }

  /**
   * Obtener todos los productos activos
   */
  async obtenerTodos() {
    const query = `
      SELECT p.id_producto, p.nombre, p.stock, p.min_stock, p.precio_unit, p.estado, p.descripcion, p.imagen_url, p.id_categoria, c.nombre as categoria
      FROM producto p
      LEFT JOIN categoria c ON p.id_categoria = c.id_categoria
      WHERE p.estado = 'activo'
      ORDER BY p.nombre
    `;

    const { rows } = await db.query(query);
    return rows.map(row => this._mapearAProducto(row));
  }

  /**
   * Buscar productos por nombre
   */
  async buscarPorNombre(nombre) {
    const query = `
      SELECT p.id_producto, p.nombre, p.stock, p.min_stock, p.precio_unit, p.estado, p.descripcion, p.imagen_url, p.id_categoria, c.nombre as categoria
      FROM producto p
      LEFT JOIN categoria c ON p.id_categoria = c.id_categoria
      WHERE p.nombre ILIKE $1 AND p.estado = 'activo'
      ORDER BY p.nombre
    `;

    const { rows } = await db.query(query, [`%${nombre}%`]);
    return rows.map(row => this._mapearAProducto(row));
  }

  /**
   * Obtener productos con stock bajo
   */
  async obtenerStockBajo() {
    const query = `
      SELECT p.id_producto, p.nombre, p.stock, p.min_stock, p.precio_unit, p.estado, p.descripcion, p.imagen_url, p.id_categoria, c.nombre as categoria
      FROM producto p
      LEFT JOIN categoria c ON p.id_categoria = c.id_categoria
      WHERE p.stock <= p.min_stock AND p.estado = 'activo'
      ORDER BY p.stock ASC
    `;

    const { rows } = await db.query(query);
    return rows.map(row => this._mapearAProducto(row));
  }

  /**
   * Decrementar stock (venta)
   */
  async decrementarStock(idProducto, cantidad) {
    const query = `
      UPDATE producto
      SET stock = stock - $1
      WHERE id_producto = $2 AND stock >= $1
      RETURNING stock
    `;

    const { rows } = await db.query(query, [cantidad, idProducto]);
    
    if (rows.length === 0) {
      throw new Error('Stock insuficiente o producto no encontrado');
    }

    return rows[0].stock;
  }

  /**
   * Incrementar stock (restock)
   */
  async incrementarStock(idProducto, cantidad) {
    const query = `
      UPDATE producto
      SET stock = stock + $1
      WHERE id_producto = $2
      RETURNING stock
    `;

    const { rows } = await db.query(query, [cantidad, idProducto]);
    return rows[0]?.stock || null;
  }

  /**
   * Productos más vendidos
   */
  async obtenerMasVendidos(limite = 10) {
    const query = `
      SELECT p.id_producto, p.nombre, p.precio_unit, SUM(db.cantidad) as cantidad_vendida, c.nombre as categoria
      FROM producto p
      JOIN detalle_boleta db ON p.id_producto = db.id_producto
      JOIN boleta b ON db.id_boleta = b.id_boleta
      LEFT JOIN categoria c ON p.id_categoria = c.id_categoria
      WHERE p.estado = 'activo' AND b.estado_boleta = 'pagado'
      GROUP BY p.id_producto, p.nombre, p.precio_unit, c.nombre
      ORDER BY cantidad_vendida DESC
      LIMIT $1
    `;

    const { rows } = await db.query(query, [limite]);
    return rows.map(row => this._mapearAProducto(row));
  }

  /**
   * Mapear fila de BD a Entidad Producto
   */
  _mapearAProducto(fila) {
    const producto = new Producto(
      fila.id_producto,
      fila.nombre,
      new Precio(fila.precio_unit),
      fila.stock,
      fila.min_stock,
      fila.descripcion,
      fila.imagen_url,
      fila.id_categoria
    );
    // Atributo dinámico para mantener el nombre de la categoría
    producto.categoria = fila.categoria || null;
    return producto;
  }
}

module.exports = ProductoRepository;
