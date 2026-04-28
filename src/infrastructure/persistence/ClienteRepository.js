const db = require('../../config/db');
const Cliente = require('../../domain/entities/Cliente');
const Email = require('../../domain/valueObjects/Email');

/**
 * Repository: ClienteRepository
 * Persistencia de Agregados Cliente
 */
class ClienteRepository {
  /**
   * Guardar cliente
   */
  async guardar(cliente) {
    cliente.validar();

    // Primero guardar en usuario
    const queryUsuario = `
      INSERT INTO usuario (user_name, contrasena, nombres, apellidos, rol, estado)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (user_name) DO UPDATE SET
        contrasena = EXCLUDED.contrasena,
        nombres = EXCLUDED.nombres,
        apellidos = EXCLUDED.apellidos,
        rol = EXCLUDED.rol
      RETURNING id_usuario
    `;

    const { rows: rowsUsuario } = await db.query(queryUsuario, [
      cliente.nombre,
      cliente.contrasena,
      cliente.nombre,
      cliente.apellidos,
      'cliente',
      cliente.estado
    ]);

    const idUsuario = rowsUsuario[0].id_usuario;

    // Luego guardar en cliente
    const queryCliente = `
      INSERT INTO cliente (id_usuario_cliente, telefono, correo, direccion, estado)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (id_usuario_cliente) DO UPDATE SET
        telefono = EXCLUDED.telefono,
        correo = EXCLUDED.correo,
        direccion = EXCLUDED.direccion,
        estado = EXCLUDED.estado
      RETURNING id_usuario_cliente, telefono, correo, direccion, estado
    `;

    const { rows: rowsCliente } = await db.query(queryCliente, [
      idUsuario,
      cliente.telefono,
      cliente.correo,
      cliente.direccion,
      cliente.estado
    ]);

    return rowsCliente[0];
  }

  /**
   * Obtener cliente por ID
   */
  async obtenerPorId(idCliente) {
    const query = `
      SELECT u.id_usuario, u.user_name, u.contrasena, u.nombres, u.apellidos,
             c.telefono, c.correo, c.direccion, c.estado
      FROM usuario u
      JOIN cliente c ON u.id_usuario = c.id_usuario_cliente
      WHERE u.id_usuario = $1
    `;

    const { rows } = await db.query(query, [idCliente]);

    if (rows.length === 0) {
      return null;
    }

    return this._mapearACliente(rows[0]);
  }

  /**
   * Obtener cliente por correo
   */
  async obtenerPorCorreo(correo) {
    const query = `
      SELECT u.id_usuario, u.user_name, u.contrasena, u.nombres, u.apellidos,
             c.telefono, c.correo, c.direccion, c.estado
      FROM usuario u
      JOIN cliente c ON u.id_usuario = c.id_usuario_cliente
      WHERE c.correo = $1
    `;

    const { rows } = await db.query(query, [correo]);

    if (rows.length === 0) {
      return null;
    }

    return this._mapearACliente(rows[0]);
  }

  /**
   * Obtener todos los clientes
   */
  async obtenerTodos() {
    const query = `
      SELECT u.id_usuario, u.user_name, u.contrasena, u.nombres, u.apellidos,
             c.telefono, c.correo, c.direccion, c.estado
      FROM usuario u
      JOIN cliente c ON u.id_usuario = c.id_usuario_cliente
      WHERE c.estado = 'activo'
      ORDER BY u.nombres
    `;

    const { rows } = await db.query(query);
    return rows.map(row => this._mapearACliente(row));
  }

  /**
   * Actualizar cliente
   */
  async actualizar(idCliente, clienteActualizado) {
    clienteActualizado.validar();

    const query = `
      UPDATE cliente
      SET telefono = $1, correo = $2, direccion = $3, estado = $4
      WHERE id_usuario_cliente = $5
      RETURNING id_usuario_cliente, telefono, correo, direccion, estado
    `;

    const { rows } = await db.query(query, [
      clienteActualizado.telefono,
      clienteActualizado.correo,
      clienteActualizado.direccion,
      clienteActualizado.estado,
      idCliente
    ]);

    return rows[0] || null;
  }

  /**
   * Eliminar cliente (lógico)
   */
  async eliminar(idCliente) {
    const query = `
      UPDATE cliente
      SET estado = 'inactivo'
      WHERE id_usuario_cliente = $1
      RETURNING id_usuario_cliente
    `;

    const { rows } = await db.query(query, [idCliente]);
    return rows[0] !== null;
  }

  /**
   * Mapear fila de BD a Entidad Cliente
   */
  _mapearACliente(fila) {
    return new Cliente(
      fila.id_usuario,
      fila.nombres,
      new Email(fila.correo),
      fila.contrasena,
      fila.apellidos,
      fila.telefono,
      fila.direccion,
      fila.estado,
      fila.correo
    );
  }
}

module.exports = ClienteRepository;
