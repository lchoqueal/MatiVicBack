const db = require('../../config/db');
const Usuario = require('../../domain/entities/Usuario');

/**
 * Repository: UsuarioRepository
 * Persistencia de Agregados Usuario
 */
class UsuarioRepository {
  /**
   * Guardar usuario
   */
  async guardar(usuario) {
    usuario.validar();

    const query = `
      INSERT INTO usuario (name_user, contrasena, nombres, apellidos, rol, estado)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (name_user) DO UPDATE SET
        contrasena = EXCLUDED.contrasena,
        nombres = EXCLUDED.nombres,
        apellidos = EXCLUDED.apellidos,
        rol = EXCLUDED.rol,
        estado = EXCLUDED.estado
      RETURNING id_usuario, name_user, contrasena, nombres, apellidos, rol, estado
    `;

    const { rows } = await db.query(query, [
      usuario.nombre,
      usuario.contrasena,
      usuario.nombre,
      usuario.apellidos,
      usuario.rol,
      usuario.estado
    ]);

    return rows[0];
  }

  /**
   * Obtener usuario por ID
   */
  async obtenerPorId(id) {
    const query = `
      SELECT id_usuario, name_user, contrasena, nombres, apellidos, estado
      FROM usuario
      WHERE id_usuario = $1
    `;

    const { rows } = await db.query(query, [id]);
    return rows[0] || null;
  }

  /**
   * Obtener usuario por nombre de usuario (login)
   */
  async obtenerPorNombreUsuario(nombreUsuario) {
    const query = `
      SELECT id_usuario, name_user, contrasena, nombres, apellidos, rol, estado
      FROM usuario
      WHERE name_user = $1
    `;

    const { rows } = await db.query(query, [nombreUsuario]);
    return rows[0] || null;
  }

  /**
   * Obtener todos los usuarios
   */
  async obtenerTodos() {
    const query = `
      SELECT id_usuario, name_user, nombres, apellidos, estado
      FROM usuario
      WHERE estado = 'activo'
      ORDER BY nombres
    `;

    const { rows } = await db.query(query);
    return rows;
  }

  /**
   * Actualizar usuario
   */
  async actualizar(id, usuarioActualizado) {
    usuarioActualizado.validar();

    const query = `
      UPDATE usuario
      SET nombres = $1, apellidos = $2, estado = $3
      WHERE id_usuario = $4
      RETURNING id_usuario, name_user, nombres, apellidos, estado
    `;

    const { rows } = await db.query(query, [
      usuarioActualizado.nombre,
      usuarioActualizado.apellidos,
      usuarioActualizado.estado,
      id
    ]);

    return rows[0] || null;
  }

  /**
   * Eliminar usuario (lógico - cambiar estado)
   */
  async eliminar(id) {
    const query = `
      UPDATE usuario
      SET estado = 'inactivo'
      WHERE id_usuario = $1
      RETURNING id_usuario
    `;

    const { rows } = await db.query(query, [id]);
    return rows[0] !== null;
  }
}

module.exports = UsuarioRepository;
