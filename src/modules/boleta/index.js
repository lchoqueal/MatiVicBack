const BoletaRepository = require('./infrastructure/BoletaRepository');
const CarritoRepository = require('../carrito/infrastucture/CarritoRepository');
const ProductoRepository = require('../producto/infrastructure/ProductoRepository');
const CrearBoletaApplicationService = require('./application/CrearBoletaApplicationService')

const boletaRoutes = require ('./presentation/routes/boletaRoutes');

module.exports = (socketIOEmitter) =>{
    const boletaRepository = new BoletaRepository();
    const carritoRepository = new CarritoRepository();
    const productoRepository = new ProductoRepository();

    const crearBoletaApplicationService = new CrearBoletaApplicationService(
        boletaRepository,
        carritoRepository,
        productoRepository,
        socketIOEmitter
    );

    return boletaRoutes(
        crearBoletaApplicationService,
        boletaRepository
    );
};

