const ProductoRepository = require('./infrastructure/ProductoRepository');
const ObtenerProductosApplicationService = require('./application/ObtenerProductosApplicationService');
const ActualizarProductoApplicationService = require('./application/ActualizarProductoApplicationService');
const EliminarProductoApplicationService = require('./application/EliminarProductoApplicationService');
const CrearProductoApplicationService = require('./application/CrearProductoApplicationService');

const productoRoutes =require('./presentation/routes/productoRoutes');

module.exports = (socketIOEmitter) => {
    const productoRepository = new ProductoRepository();

    const obtenerProductosApplicationService = new ObtenerProductosApplicationService(productoRepository);
    const actualizarProductoApplicationService = new ActualizarProductoApplicationService(productoRepository, socketIOEmitter);
    const eliminarProductoApplicationService = new EliminarProductoApplicationService(productoRepository);
    const crearProductoApplicationService = new CrearProductoApplicationService(productoRepository, socketIOEmitter);

    return productoRoutes(
        obtenerProductosApplicationService,
        actualizarProductoApplicationService,
        eliminarProductoApplicationService,
        crearProductoApplicationService
    );
};