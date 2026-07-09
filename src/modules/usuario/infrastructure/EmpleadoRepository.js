const db = require('../../../shared/config/db');

/**
 * Repository: EmpleadoRepository
 * Persistencia de datos de Empleados
 */
class EmpleadoRepository {
  /**
   * Crear empleado (insert en tabla empleado)
   */
  async crear(idUsuarioEmpleado, fechaIngreso, horario) {
    const query = `
      INSERT INTO empleado (id_usuario_empleado, fecha_ingreso, horario, estado_empleado)
      VALUES ($1, $2, $3, $4)
      RETURNING id_usuario_empleado, fecha_ingreso, horario, estado_empleado
    `;

    const { rows } = await db.query(query, [
      idUsuarioEmpleado,
      fechaIngreso,
      horario,
      'activo'
    ]);

    return rows[0];
  }

  /**
   * Obtener empleado por id_usuario_empleado
   */
  async obtenerPorIdUsuario(idUsuarioEmpleado) {
    const query = `
      SELECT id_usuario_empleado, fecha_ingreso, horario, estado_empleado
      FROM empleado
      WHERE id_usuario_empleado = $1
    `;

    const { rows } = await db.query(query, [idUsuarioEmpleado]);
    return rows[0] || null;
  }

  /**
   * Obtener todos los empleados activos
   */
  async obtenerTodos() {
    const query = `
      SELECT e.id_usuario_empleado, u.nombres, u.apellidos, u.user_name, u.rol,
             e.fecha_ingreso, e.horario, e.estado_empleado
      FROM empleado e
      INNER JOIN usuario u ON e.id_usuario_empleado = u.id_usuario
      WHERE e.estado_empleado = 'activo'
      ORDER BY u.nombres
    `;

    const { rows } = await db.query(query);
    return rows;
  }

  /**
   * Actualizar estado empleado
   */
  async actualizarEstado(idUsuarioEmpleado, estado) {
    const query = `
      UPDATE empleado
      SET estado_empleado = $1
      WHERE id_usuario_empleado = $2
      RETURNING id_usuario_empleado, estado_empleado
    `;

    const { rows } = await db.query(query, [estado, idUsuarioEmpleado]);
    return rows[0] || null;
  }

  /**
   * Actualizar horario empleado
   */
  async actualizarHorario(idUsuarioEmpleado, horario) {
    const query = `
      UPDATE empleado
      SET horario = $1
      WHERE id_usuario_empleado = $2
      RETURNING id_usuario_empleado, horario
    `;

    const { rows } = await db.query(query, [horario, idUsuarioEmpleado]);
    return rows[0] || null;
  }
}

module.exports = EmpleadoRepository;
