const autenticacionRoutes = require('../../usuario/presentation/routes/autenticacionRoutes');
const productoRoutes = require('../../producto/presentation/routes/productoRoutes');
const alertasRoutes = require('../../producto/presentation/routes/alertasRoutes');
const carritoRoutes = require('../../carrito/presentation/routes/carritoRoutes');
const boletaRoutes = require('../../boleta/presentation/boletaRoutes');
const reportesRoutes = require('../../reporte/presentation/routes/reportesRoutes');

/**
 * Registra todas las rutas de la aplicación
 * @param {Express.Application} app - Instancia de Express
 * @param {Object} repositories - Objeto con todos los repositorios
 * @param {Object} applicationServices - Objeto con todos los servicios de aplicación
 * @param {SocketIOEmitter} socketIOEmitter - Emisor de eventos Socket.IO
 */
module.exports = (app, repositories, applicationServices, socketIOEmitter) => {
  // Rutas de autenticación
  app.use('/auth', autenticacionRoutes(applicationServices.autenticacionApplicationService));

  // Rutas de productos
  app.use('/productos', productoRoutes(
    applicationServices.obtenerProductosApplicationService,
    applicationServices.actualizarProductoApplicationService,
    applicationServices.eliminarProductoApplicationService,
    repositories.productoRepository,
    socketIOEmitter
  ));

  // Rutas de alertas
  app.use('/alertas', alertasRoutes(
    applicationServices.obtenerAlertasApplicationService,
    repositories.productoRepository
  ));

  // Rutas de carrito
  app.use('/carrito', carritoRoutes(
    applicationServices.agregarProductoCarritoApplicationService,
    repositories.carritoRepository,
    socketIOEmitter
  ));

  // Rutas de boletas
  app.use('/boletas', boletaRoutes(
    applicationServices.crearBoletaApplicationService,
    repositories.boletaRepository
  ));

  // Rutas de reportes
  app.use('/reportes', reportesRoutes(
    applicationServices.obtenerReportesApplicationService
  ));

  // Health check
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });
};
