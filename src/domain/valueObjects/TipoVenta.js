const DomainException = require('../exceptions/DomainException');

/**
 * Value Object: TipoVenta
 * Solo acepta valores específicos: 'online' o 'fisica'
 */
class TipoVenta {
  static ONLINE = 'online';
  static FISICA = 'fisica';

  static VALORES_VALIDOS = [TipoVenta.ONLINE, TipoVenta.FISICA];

  constructor(valor) {
    this.validar(valor);
    this.valor = valor;
  }

  validar(valor) {
    if (!valor || typeof valor !== 'string') {
      throw new DomainException('TipoVenta es requerido y debe ser texto', 400, 'TIPO_VENTA_INVALIDO');
    }

    if (!TipoVenta.VALORES_VALIDOS.includes(valor)) {
      throw new DomainException(
        `TipoVenta debe ser: ${TipoVenta.VALORES_VALIDOS.join(', ')}`,
        400,
        'TIPO_VENTA_NO_VALIDO'
      );
    }
  }

  esOnline() {
    return this.valor === TipoVenta.ONLINE;
  }

  esFisica() {
    return this.valor === TipoVenta.FISICA;
  }

  equals(otro) {
    return otro instanceof TipoVenta && this.valor === otro.valor;
  }

  toString() {
    return this.valor;
  }
}

module.exports = TipoVenta;
