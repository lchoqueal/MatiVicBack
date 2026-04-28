/**
 * Excepción base para la aplicación
 * Herencia de todas las excepciones
 */
class ApplicationException extends Error {
  constructor(mensaje, statusCode = 500, codigo = 'ERROR_GENERAL') {
    super(mensaje);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.codigo = codigo;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApplicationException;
