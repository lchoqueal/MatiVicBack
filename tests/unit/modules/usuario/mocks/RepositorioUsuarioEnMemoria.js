class RepositorioUsuarioEnMemoria {
  constructor() {
    this.usuariosPorUsername = new Map();
    this.usuariosPorId = new Map();
    this.secuenciaId = 1;
  }

  async guardar(usuario) {
    usuario.validar();

    const id = usuario.id || this.secuenciaId++;
    const registro = {
      id_usuario: id,
      user_name: usuario.nombre,
      contrasena: usuario.contrasena,
      nombres: usuario.nombre,
      apellidos: usuario.apellidos,
      rol: usuario.rol,
      estado: usuario.estado
    };

    this.usuariosPorUsername.set(registro.user_name, registro);
    this.usuariosPorId.set(registro.id_usuario, registro);

    return registro;
  }

  async obtenerPorNombreUsuario(nombreUsuario) {
    return this.usuariosPorUsername.get(nombreUsuario) || null;
  }

  async obtenerPorId(id) {
    return this.usuariosPorId.get(id) || null;
  }

  async obtenerTodos() {
    return Array.from(this.usuariosPorId.values()).filter((usuario) => usuario.estado === 'activo');
  }

  async actualizar(id, usuarioActualizado) {
    usuarioActualizado.validar();

    const existente = this.usuariosPorId.get(id);
    if (!existente) {
      return null;
    }

    const actualizado = {
      ...existente,
      nombres: usuarioActualizado.nombre,
      apellidos: usuarioActualizado.apellidos,
      estado: usuarioActualizado.estado
    };

    this.usuariosPorId.set(id, actualizado);
    this.usuariosPorUsername.set(actualizado.user_name, actualizado);

    return actualizado;
  }

  async eliminar(id) {
    const existente = this.usuariosPorId.get(id);
    if (!existente) {
      return false;
    }

    existente.estado = 'inactivo';
    this.usuariosPorId.set(id, existente);

    return true;
  }
}

module.exports = RepositorioUsuarioEnMemoria;
