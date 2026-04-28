const DomainException = require('../exceptions/DomainException');

/**
 * Value Object: Stock
 * Immutable, validado, comparable por valor
 */
class Stock {
  constructor(cantidad, minimo = 0) {
    this.validar(cantidad, minimo);
    this.cantidad = parseInt(cantidad);
    this.minimo = parseInt(minimo);
  }

  validar(cantidad, minimo) {
    if (cantidad === null || cantidad === undefined) {
      throw new DomainException('Stock es requerido', 400, 'STOCK_REQUERIDO');
    }

    const cantNum = parseInt(cantidad);

    if (isNaN(cantNum)) {
      throw new DomainException('Stock debe ser un número', 400, 'STOCK_NO_NUMERO');
    }

    if (cantNum < 0) {
      throw new DomainException('Stock no puede ser negativo', 400, 'STOCK_NEGATIVO');
    }

    if (minimo && parseInt(minimo) < 0) {
      throw new DomainException('Stock mínimo no puede ser negativo', 400, 'MINIMO_NEGATIVO');
    }
  }

  decrementar(cantidad) {
    if (cantidad > this.cantidad) {
      throw new DomainException('Stock insuficiente', 400, 'STOCK_INSUFICIENTE');
    }
    return new Stock(this.cantidad - cantidad, this.minimo);
  }

  incrementar(cantidad) {
    return new Stock(this.cantidad + cantidad, this.minimo);
  }

  estaBajo() {
    return this.cantidad <= this.minimo;
  }

  equals(otro) {
    return otro instanceof Stock && this.cantidad === otro.cantidad;
  }

  toString() {
    return this.cantidad.toString();
  }
}

module.exports = Stock;
