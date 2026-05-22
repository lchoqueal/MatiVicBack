const DomainException = require('../../../../shared/domain/exceptions/DomainException');

class BoletaInvalidaException extends DomainException {
  constructor(mensaje = 'Boleta inválida') {
    super(mensaje, 422, 'BOLETA_INVALIDA');
  }
}

module.exports = BoletaInvalidaException;
