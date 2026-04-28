const DomainException = require('./DomainException');

class StockInsuficienteException extends DomainException {
  constructor(producto = 'Producto', disponible = 0, solicitado = 0) {
    const mensaje = `Stock insuficiente de ${producto}. Disponible: ${disponible}, Solicitado: ${solicitado}`;
    super(mensaje, 400, 'STOCK_INSUFICIENTE');
  }
}

module.exports = StockInsuficienteException;
