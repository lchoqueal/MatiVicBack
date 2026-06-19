const ProductoRepository = require('./infrastructure/ProductoRepository');
const ObtenerProductosApplicationService = require('./application/ObtenerProductosApplicationService');
const ObtenerAlertasApplicationService = require('./application/ObtenerAlertasApplicationService');
const ActualizarProductoApplicationService = require('./application/ActualizarProductoApplicationService');
const EliminarProductoApplicationService = require('./application/EliminarProductoApplicationService');

const productoRoutes = require('./presentation/routes/productoRoutes');
const alertasRoutes = require('./presentation/routes/alertasRoutes');

module.exports = (socketIOEmitter) => {
    const productoRepository = new ProductoRepository();

    const obtenerProductosApplicationService = new ObtenerProductosApplicationService(productoRepository);
    const obtenerAlertasApplicationService = new ObtenerAlertasApplicationService(
        productoRepository,
        socketIOEmitter
    );
    const actualizarProductoApplicationService = new ActualizarProductoApplicationService(
        productoRepository,
        socketIOEmitter
    );
    const eliminarProductoApplicationService = new EliminarProductoApplicationService(productoRepository);

    return {
        productoRoutes: productoRoutes(
            obtenerProductosApplicationService,
            actualizarProductoApplicationService,
            eliminarProductoApplicationService
        ),
        alertasRoutes: alertasRoutes(obtenerAlertasApplicationService)
    };
};