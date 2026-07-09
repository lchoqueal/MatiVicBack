const db = require('../../../shared/config/db');
const Categoria = require('../domain/entities/Categoria');

/**
 * Repository: CategoriaRepository
 * Persistencia de Agregados Categoria
 */
class CategoriaRepository {
  /**
   * Guardar categoría (crear o actualizar)
   */
  async guardar(categoria) {
    const query = `
      INSERT INTO categoria (nombre, descripcion, orden, estado)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (id_categoria) DO UPDATE SET
        nombre = EXCLUDED.nombre,
        descripcion = EXCLUDED.descripcion,
        orden = EXCLUDED.orden,
        estado = EXCLUDED.estado
      RETURNING id_categoria, nombre, descripcion, orden, estado
    `;

    const { rows } = await db.query(query, [
      categoria.nombre,
      categoria.descripcion,
      categoria.orden,
      categoria.estado
    ]);

    return this._mapearACategoria(rows[0]);
  }

  /**
   * Obtener todas las categorías activas
   */
  async obtenerTodas() {
    const query = `
      SELECT id_categoria, nombre, descripcion, orden, estado
      FROM categoria
      WHERE estado = 'activo'
      ORDER BY orden
    `;

    const { rows } = await db.query(query);
    return rows.map(row => this._mapearACategoria(row));
  }

  /**
   * Obtener categoría por ID
   */
  async obtenerPorId(id) {
    const query = `
      SELECT id_categoria, nombre, descripcion, orden, estado
      FROM categoria
      WHERE id_categoria = $1
    `;

    const { rows } = await db.query(query, [id]);
    return rows[0] ? this._mapearACategoria(rows[0]) : null;
  }

  /**
   * Obtener categoría por nombre
   */
  async obtenerPorNombre(nombre) {
    const query = `
      SELECT id_categoria, nombre, descripcion, orden, estado
      FROM categoria
      WHERE nombre ILIKE $1
    `;

    const { rows } = await db.query(query, [`%${nombre}%`]);
    return rows.map(row => this._mapearACategoria(row));
  }

  /**
   * Mapear row de BD a entidad Categoria
   */
  _mapearACategoria(row) {
    return new Categoria(
      row.id_categoria,
      row.nombre,
      row.descripcion,
      row.orden,
      row.estado
    );
  }
}

module.exports = CategoriaRepository;
