const Stock = require('../valueObjects/Stock');
const Precio = require('../valueObjects/Precio');

/**
 * Entidad: Producto (Aggregate Root)
 * Representa un producto del catálogo
 * Protege invariantes: stock >= 0, precio > 0
 */
class Producto {
  constructor(id, nombre, precio, stock, minStock, descripcion = '', imagenUrl = '', idCategoria = null) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio instanceof Precio ? precio : new Precio(precio);
    this.stock = stock instanceof Stock ? stock : new Stock(stock, minStock);
    this.minStock = minStock;
    this.descripcion = descripcion;
    this.imagenUrl = imagenUrl;
    this.idCategoria = idCategoria;
    this.estado = 'activo';
    this.createdAt = new Date();
  }

  /**
   * Validar reglas del Agregado
   */
  validar() {
    if (!this.nombre || this.nombre.trim() === '') {
      throw new Error('Nombre de producto requerido');
    }

    if (this.stock.cantidad < 0) {
      throw new Error('Stock no puede ser negativo');
    }

    if (this.precio.monto <= 0) {
      throw new Error('Precio debe ser positivo');
    }
  }

  /**
   * Decrementar stock (venta)
   */
  vender(cantidad) {
    this.stock = this.stock.decrementar(cantidad);
    return this;
  }

  /**
   * Incrementar stock (restock)
   */
  reabastecer(cantidad) {
    this.stock = this.stock.incrementar(cantidad);
    return this;
  }

  /**
   * ¿Stock está bajo?
   */
  tieneStockBajo() {
    return this.stock.estaBajo();
  }

  /**
   * ¿Hay stock disponible para vender?
   */
  hayStockPara(cantidad) {
    return this.stock.cantidad >= cantidad;
  }

  /**
   * Cambiar precio
   */
  cambiarPrecio(nuevoPrecio) {
    this.precio = nuevoPrecio instanceof Precio ? nuevoPrecio : new Precio(nuevoPrecio);
    return this;
  }

  /**
   * Desactivar producto
   */
  desactivar() {
    this.estado = 'inactivo';
    return this;
  }

  /**
   * Activar producto
   */
  activar() {
    this.estado = 'activo';
    return this;
  }
}

module.exports = Producto;
