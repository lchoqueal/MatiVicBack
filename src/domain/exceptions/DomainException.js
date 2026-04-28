const ApplicationException = require('../../shared/exceptions/ApplicationException');

/**
 * Excepción base para excepciones del dominio
 * Representan violaciones de reglas de negocio
 */
class DomainException extends ApplicationException {
  constructor(mensaje, statusCode = 400, codigo = 'ERROR_DOMINIO') {
    super(mensaje, statusCode, codigo);
  }
}

module.exports = DomainException;
