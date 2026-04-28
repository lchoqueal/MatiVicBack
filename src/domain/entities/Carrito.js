const Precio = require('../valueObjects/Precio');
const CarritoVacioException = require('../exceptions/CarritoVacioException');

/**
 * Entidad: Carrito (Aggregate Root)
 * Contiene items del carrito
 * Protege invariantes: total = suma de items, items >= 0
 */
class Carrito {
  constructor(id, tipoCarrito, idCliente = null, idEmpleado = null) {
    this.id = id;
    this.tipoCarrito = tipoCarrito; // 'cliente' o 'venta_fisica'
    this.idCliente = idCliente;
    this.idEmpleado = idEmpleado;
    this.items = [];
    this.total = new Precio(0);
    this.estado = 'activo';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * Agregar producto al carrito
   */
  agregarItem(producto, cantidad) {
    if (cantidad <= 0) {
      throw new Error('Cantidad debe ser mayor a 0');
    }

    if (!producto.hayStockPara(cantidad)) {
      throw new Error(`Stock insuficiente de ${producto.nombre}`);
    }

    // Verificar si el producto ya existe en el carrito
    const itemExistente = this.items.find(item => item.idProducto === producto.id);

    if (itemExistente) {
      itemExistente.cantidad += cantidad;
    } else {
      this.items.push({
        idProducto: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad,
        subtotal: producto.precio.multiplicar(cantidad)
      });
    }

    // Recalcular total
    this.recalcularTotal();
    this.updatedAt = new Date();

    return this;
  }

  /**
   * Eliminar item del carrito
   */
  eliminarItem(idProducto) {
    this.items = this.items.filter(item => item.idProducto !== idProducto);
    this.recalcularTotal();
    this.updatedAt = new Date();
    return this;
  }

  /**
   * Cambiar cantidad de item
   */
  cambiarCantidadItem(idProducto, nuevaCantidad) {
    const item = this.items.find(i => i.idProducto === idProducto);

    if (!item) {
      throw new Error('Item no encontrado en carrito');
    }

    if (nuevaCantidad <= 0) {
      return this.eliminarItem(idProducto);
    }

    item.cantidad = nuevaCantidad;
    item.subtotal = item.precio.multiplicar(nuevaCantidad);

    this.recalcularTotal();
    this.updatedAt = new Date();

    return this;
  }

  /**
   * Recalcular total (invariante)
   */
  recalcularTotal() {
    let totalMonto = 0;

    for (const item of this.items) {
      totalMonto += item.subtotal.monto;
    }

    this.total = new Precio(totalMonto);
  }

  /**
   * Validar reglas del Agregado
   */
  validar() {
    if (this.items.length === 0) {
      throw new CarritoVacioException();
    }

    if (this.total.monto <= 0) {
      throw new Error('Total debe ser mayor a 0');
    }
  }

  /**
   * Limpiar carrito
   */
  vaciar() {
    this.items = [];
    this.total = new Precio(0);
    this.updatedAt = new Date();
    return this;
  }

  /**
   * ¿Carrito está vacío?
   */
  estaVacio() {
    return this.items.length === 0;
  }

  /**
   * Cantidad de items diferentes
   */
  cantidadItems() {
    return this.items.length;
  }

  /**
   * Cantidad total de unidades
   */
  cantidadUnidades() {
    return this.items.reduce((sum, item) => sum + item.cantidad, 0);
  }
}

module.exports = Carrito;
