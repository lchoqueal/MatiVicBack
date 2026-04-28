const Precio = require('../valueObjects/Precio');
const TipoVenta = require('../valueObjects/TipoVenta');
const BoletaInvalidaException = require('../exceptions/BoletaInvalidaException');

/**
 * Entidad: Boleta (Aggregate Root)
 * Representa una venta/compra
 * Protege invariantes: tipo_venta válido, total > 0, estado válido
 */
class Boleta {
  static ESTADOS = {
    PENDIENTE: 'pendiente',
    PAGADO: 'pagado',
    CANCELADO: 'cancelado'
  };

  constructor(id, tipoVenta, total, metodoPago, idCliente = null, idEmpleado = null, idLocal = null, idCarrito = null) {
    this.id = id;
    this.tipoVenta = tipoVenta instanceof TipoVenta ? tipoVenta : new TipoVenta(tipoVenta);
    this.total = total instanceof Precio ? total : new Precio(total);
    this.metodoPago = metodoPago;
    this.idCliente = idCliente;
    this.idEmpleado = idEmpleado;
    this.idLocal = idLocal;
    this.idCarrito = idCarrito;
    this.estado = Boleta.ESTADOS.PENDIENTE;
    this.items = [];
    this.fechaEmision = new Date();
    this.createdAt = new Date();
  }

  /**
   * Validar reglas del Agregado
   */
  validar() {
    // Validar tipo de venta
    if (!this.tipoVenta) {
      throw new BoletaInvalidaException('Tipo de venta es requerido');
    }

    // Validar total
    if (this.total.monto <= 0) {
      throw new BoletaInvalidaException('Total debe ser mayor a 0');
    }

    // Validar estado
    if (!Object.values(Boleta.ESTADOS).includes(this.estado)) {
      throw new BoletaInvalidaException('Estado de boleta inválido');
    }

    // Para venta online, debe tener cliente
    if (this.tipoVenta.esOnline() && !this.idCliente) {
      throw new BoletaInvalidaException('Venta online requiere cliente');
    }

    // Para venta física, debe tener empleado
    if (this.tipoVenta.esFisica() && !this.idEmpleado) {
      throw new BoletaInvalidaException('Venta física requiere empleado');
    }
  }

  /**
   * Cambiar estado
   */
  cambiarEstado(nuevoEstado) {
    const transiciones = {
      [Boleta.ESTADOS.PENDIENTE]: [Boleta.ESTADOS.PAGADO, Boleta.ESTADOS.CANCELADO],
      [Boleta.ESTADOS.PAGADO]: [Boleta.ESTADOS.CANCELADO],
      [Boleta.ESTADOS.CANCELADO]: []
    };

    if (!transiciones[this.estado]?.includes(nuevoEstado)) {
      throw new BoletaInvalidaException(
        `No se puede cambiar de ${this.estado} a ${nuevoEstado}`
      );
    }

    this.estado = nuevoEstado;
    return this;
  }

  /**
   * Marcar como pagada
   */
  marcarPagada() {
    return this.cambiarEstado(Boleta.ESTADOS.PAGADO);
  }

  /**
   * Cancelar boleta
   */
  cancelar() {
    return this.cambiarEstado(Boleta.ESTADOS.CANCELADO);
  }

  /**
   * ¿Es venta online?
   */
  esOnline() {
    return this.tipoVenta.esOnline();
  }

  /**
   * ¿Es venta física?
   */
  esFisica() {
    return this.tipoVenta.esFisica();
  }

  /**
   * ¿Está pagada?
   */
  estaPagada() {
    return this.estado === Boleta.ESTADOS.PAGADO;
  }

  /**
   * ¿Está cancelada?
   */
  estaCancelada() {
    return this.estado === Boleta.ESTADOS.CANCELADO;
  }

  /**
   * Agregar item
   */
  agregarItem(idProducto, cantidad, precio, subtotal) {
    this.items.push({
      idProducto,
      cantidad,
      precio,
      subtotal
    });
    return this;
  }
}

module.exports = Boleta;
