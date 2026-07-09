/**
 * Entidad: Categoria (Aggregate Root)
 * Representa una categoría de productos del catálogo
 */
class Categoria {
  constructor(id, nombre, descripcion = '', orden = 1, estado = 'activo') {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.orden = orden;
    this.estado = estado;
  }

  /**
   * Validar reglas del Agregado
   */
  validar() {
    if (!this.nombre || this.nombre.trim() === '') {
      throw new Error('Nombre de categoría requerido');
    }

    if (this.orden < 0) {
      throw new Error('Orden debe ser positivo');
    }

    if (!['activo', 'inactivo'].includes(this.estado)) {
      throw new Error('Estado inválido (activo|inactivo)');
    }
  }

  /**
   * Desactivar categoría
   */
  desactivar() {
    this.estado = 'inactivo';
    return this;
  }

  /**
   * Activar categoría
   */
  activar() {
    this.estado = 'activo';
    return this;
  }

  /**
   * Actualizar orden
   */
  actualizarOrden(nuevoOrden) {
    if (nuevoOrden < 0) {
      throw new Error('Orden debe ser positivo');
    }
    this.orden = nuevoOrden;
    return this;
  }
}

module.exports = Categoria;
