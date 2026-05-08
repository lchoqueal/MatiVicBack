const CarritoRepository = require('./infrastucture/CarritoRepository');
const ProductoRepository = require('../producto/infrastructure/ProductoRepository');
const AgregarProductoCarritoApplicationService = require('./application/AgregarProductoCarritoApplicationService');

const carritoRoutes = require('./presentation/routes/carritoRoutes');

module.exports = (socketIOEmitter) => {
  const carritoRepository = new CarritoRepository();
  const productoRepository = new ProductoRepository();

  const agregarProductoCarritoApplicationService = new AgregarProductoCarritoApplicationService(
    carritoRepository,
    productoRepository,
    socketIOEmitter
  );

  return carritoRoutes(
    agregarProductoCarritoApplicationService,
    carritoRepository
  );
};
