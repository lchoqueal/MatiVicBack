/**
 * Archivo: src/presentation/routes/index.js
 * Registra todas las rutas con inyección de dependencias
 */

const autenticacionRoutes = require('./autenticacionRoutes');
const productoRoutes = require('./productoRoutes');
const carritoRoutes = require('./carritoRoutes');
const boletaRoutes = require('./boletaRoutes');
const reportesRoutes = require('./reportesRoutes');
const alertasRoutes = require('./alertasRoutes');

/**
 * Registrar todas las rutas en Express
 */
module.exports = (app, repositories, applicationServices, socketIOEmitter) => {
  // Desempacar repositories
  const {
    usuarioRepository,
    productoRepository,
    carritoRepository,
    boletaRepository,
    clienteRepository
  } = repositories;

  // Desempacar application services
  const {
    autenticacionApplicationService,
    crearBoletaApplicationService,
    agregarProductoCarritoApplicationService,
    obtenerProductosApplicationService,
    obtenerReportesApplicationService,
    obtenerAlertasApplicationService,
    actualizarProductoApplicationService,
    eliminarProductoApplicationService
  } = applicationServices;

  // Registrar rutas
  app.use('/auth', autenticacionRoutes(autenticacionApplicationService));
  
  app.use('/productos', productoRoutes(
    obtenerProductosApplicationService,
    actualizarProductoApplicationService,
    eliminarProductoApplicationService
  ));
  
  app.use('/carritos', carritoRoutes(
    agregarProductoCarritoApplicationService,
    carritoRepository
  ));
  
  app.use('/boletas', boletaRoutes(
    crearBoletaApplicationService,
    boletaRepository
  ));
  
  app.use('/reportes', reportesRoutes(
    obtenerReportesApplicationService
  ));
  
  app.use('/alertas', alertasRoutes(
    obtenerAlertasApplicationService
  ));

  // Endpoint de salud
  app.get('/health', (req, res) => {
    res.json({
      success: true,
      status: 'OK',
      timestamp: new Date()
    });
  });
};
