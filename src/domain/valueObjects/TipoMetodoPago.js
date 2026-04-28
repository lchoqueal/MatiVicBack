const DomainException = require('../exceptions/DomainException');

/**
 * Value Object: MetodoPago
 * Solo acepta métodos válidos
 */
class MetodoPago {
  static EFECTIVO = 'efectivo';
  static TARJETA = 'tarjeta';
  static TRANSFERENCIA = 'transferencia';

  static VALORES_VALIDOS = [
    MetodoPago.EFECTIVO,
    MetodoPago.TARJETA,
    MetodoPago.TRANSFERENCIA
  ];

  constructor(valor) {
    this.validar(valor);
    this.valor = valor;
  }

  validar(valor) {
    if (!valor || typeof valor !== 'string') {
      throw new DomainException('MetodoPago es requerido y debe ser texto', 400, 'METODO_PAGO_INVALIDO');
    }

    if (!MetodoPago.VALORES_VALIDOS.includes(valor)) {
      throw new DomainException(
        `MetodoPago debe ser: ${MetodoPago.VALORES_VALIDOS.join(', ')}`,
        400,
        'METODO_PAGO_NO_VALIDO'
      );
    }
  }

  equals(otro) {
    return otro instanceof MetodoPago && this.valor === otro.valor;
  }

  toString() {
    return this.valor;
  }
}

module.exports = MetodoPago;
