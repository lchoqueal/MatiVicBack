const DomainException = require('../exceptions/DomainException');

/**
 * Value Object: Precio
 * Immutable, validado, comparable por valor
 */
class Precio {
  constructor(monto) {
    this.validar(monto);
    this.monto = parseFloat(monto);
  }

  validar(monto) {
    if (monto === null || monto === undefined) {
      throw new DomainException('Precio es requerido', 400, 'PRECIO_REQUERIDO');
    }

    const montoNum = parseFloat(monto);

    if (isNaN(montoNum)) {
      throw new DomainException('Precio debe ser un número', 400, 'PRECIO_NO_NUMERO');
    }

    if (montoNum <= 0) {
      throw new DomainException('Precio debe ser mayor a 0', 400, 'PRECIO_NO_POSITIVO');
    }

    if (montoNum > 999999999.99) {
      throw new DomainException('Precio demasiado alto', 400, 'PRECIO_DEMASIADO_ALTO');
    }
  }

  sumar(otro) {
    return new Precio(this.monto + otro.monto);
  }

  restar(otro) {
    return new Precio(this.monto - otro.monto);
  }

  multiplicar(cantidad) {
    return new Precio(this.monto * cantidad);
  }

  equals(otro) {
    return otro instanceof Precio && this.monto === otro.monto;
  }

  toString() {
    return this.monto.toFixed(2);
  }
}

module.exports = Precio;
