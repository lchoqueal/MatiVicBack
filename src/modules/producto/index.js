const ProductoRepository = require('./infrastructure/ProductoRepository');
const ObtenerProductosApplicationService = require('./application/ObtenerProductosApplicationService');
const ActualizarProductoApplicationService = require('./application/ActualizarProductoApplicationService');
const EliminarProductoApplicationService = require('./application/EliminarProductoApplicationService');

const productoRoutes =require('./presentation/routes/productoRoutes');

module.exports = (socketIOEmitter) => {
    const productoRepository = new ProductoRepository();

    const obtenerProductosApplicationService = new ObtenerAlertasApplicationService(productoRepository);
    const actualizarProductoApplicationService = new ActualizarProductoApplicationService(productoRepository);
    const eliminarProductoApplicationService = new EliminarProductoApplicationService(productoRepository);

    return productoRoutes(
        obtenerProductosApplicationService,
        actualizarProductoApplicationService,
        eliminarProductoApplicationService
    );
};