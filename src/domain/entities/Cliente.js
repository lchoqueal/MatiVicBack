const Usuario = require('./Usuario');

/**
 * Entidad: Cliente (Aggregate Root)
 * Especialización de Usuario
 * Hereda atributos y comportamiento de Usuario
 */
class Cliente extends Usuario {
  constructor(id, nombre, email, contrasena, apellidos = '', telefono = '', direccion = '', estado = 'activo', correo = '') {
    super(id, nombre, email, contrasena, apellidos, estado);
    this.telefono = telefono;
    this.direccion = direccion;
    this.correo = correo || email;  // correo puede ser diferente
    this.rol = 'cliente';
  }

  /**
   * Validar reglas del Agregado (incluye validación de Usuario)
   */
  validar() {
    super.validar();

    if (!this.correo || this.correo.trim() === '') {
      throw new Error('Correo requerido');
    }
  }

  /**
   * Actualizar datos de contacto
   */
  actualizarContacto(telefono, direccion) {
    this.telefono = telefono;
    this.direccion = direccion;
    return this;
  }

  /**
   * Validar formato de teléfono (simple)
   */
  esTelefonoValido(telefono) {
    return /^\d{9,15}$/.test(telefono.replace(/\D/g, ''));
  }
}

module.exports = Cliente;
