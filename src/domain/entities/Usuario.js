const Email = require('../valueObjects/Email');

/**
 * Entidad: Usuario (Aggregate Root)
 * Usuario base del sistema
 */
class Usuario {
  static ROLES = {
    ADMINISTRADOR: 'administrador',
    EMPLEADO: 'empleado',
    CLIENTE: 'cliente'
  };

  static VALORES_VALIDOS = Object.values(Usuario.ROLES);

  constructor(id, nombre, email, contrasena, apellidos = '', rol = 'cliente', estado = 'activo') {
    this.id = id;
    this.nombre = nombre;
    this.email = email instanceof Email ? email : new Email(email);
    this.contrasena = contrasena;
    this.apellidos = apellidos;
    this.rol = rol;
    this.estado = estado;
    this.createdAt = new Date();
  }

  /**
   * Validar reglas del Agregado
   */
  validar() {
    if (!this.nombre || this.nombre.trim() === '') {
      throw new Error('Nombre requerido');
    }

    if (!this.email) {
      throw new Error('Email requerido');
    }

    if (!this.contrasena || this.contrasena.trim() === '') {
      throw new Error('Contraseña requerida');
    }

    if (!Usuario.VALORES_VALIDOS.includes(this.rol)) {
      throw new Error(`Rol inválido. Debe ser uno de: ${Usuario.VALORES_VALIDOS.join(', ')}`);
    }
  }

  /**
   * Desactivar usuario
   */
  desactivar() {
    this.estado = 'inactivo';
    return this;
  }

  /**
   * Activar usuario
   */
  activar() {
    this.estado = 'activo';
    return this;
  }

  /**
   * ¿Está activo?
   */
  estaActivo() {
    return this.estado === 'activo';
  }

  /**
   * ¿Es administrador?
   */
  esAdministrador() {
    return this.rol === Usuario.ROLES.ADMINISTRADOR;
  }

  /**
   * ¿Es empleado?
   */
  esEmpleado() {
    return this.rol === Usuario.ROLES.EMPLEADO;
  }

  /**
   * ¿Es cliente?
   */
  esCliente() {
    return this.rol === Usuario.ROLES.CLIENTE;
  }
}

module.exports = Usuario;
