const Email = require('../valueObjects/Email');

/**
 * Entidad: Usuario (Aggregate Root)
 * Usuario base del sistema
 */
class Usuario {
  constructor(id, nombre, email, contrasena, apellidos = '', estado = 'activo') {
    this.id = id;
    this.nombre = nombre;
    this.email = email instanceof Email ? email : new Email(email);
    this.contrasena = contrasena;
    this.apellidos = apellidos;
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
}

module.exports = Usuario;
