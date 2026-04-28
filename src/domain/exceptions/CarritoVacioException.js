const DomainException = require('./DomainException');

class CarritoVacioException extends DomainException {
  constructor(mensaje = 'No se puede confirmar un carrito vacío') {
    super(mensaje, 400, 'CARRITO_VACIO');
  }
}

module.exports = CarritoVacioException;
