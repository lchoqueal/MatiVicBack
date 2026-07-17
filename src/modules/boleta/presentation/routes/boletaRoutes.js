const express = require('express');
const BoletaController = require('../controllers/BoletaController');
const autenticacionMiddleware = require('../../../../shared/middleware/autenticacionMiddleware');
const { esAdministradorOEmpleado, esAdministrador } = require('../../../../shared/middleware/rolMiddleware');
const { validarCamposRequeridos } = require('../../../../shared/middleware/validacionMiddleware');

module.exports = (
  crearBoletaApplicationService,
  boletaRepository
) => {
  const router = express.Router();
  const controller = new BoletaController(
    crearBoletaApplicationService,
    boletaRepository
  );

  // POST /boletas (requiere autenticación para registrar la venta)
  router.post('/', autenticacionMiddleware, validarCamposRequeridos(['idCarrito', 'tipoVenta', 'metodoPago']), (req, res, next) => controller.crear(req, res, next));

  // GET /boletas/cliente/:idCliente (ANTES de /:id)
  router.get('/cliente/:idCliente', autenticacionMiddleware, (req, res, next) => controller.obtenerPorCliente(req, res, next));

  // GET /boletas/empleado/:idEmpleado (ANTES de /:id)
  router.get('/empleado/:idEmpleado', autenticacionMiddleware, esAdministradorOEmpleado, (req, res, next) => controller.obtenerPorEmpleado(req, res, next));

  // GET /boletas/:id (dinámica, va después)
  router.get('/:id', autenticacionMiddleware, (req, res, next) => controller.obtenerPorId(req, res, next));

  // PUT /boletas/:id/estado (requiere administrador o empleado)
  router.put('/:id/estado', autenticacionMiddleware, esAdministradorOEmpleado, validarCamposRequeridos(['nuevoEstado']), (req, res, next) => controller.actualizarEstado(req, res, next));

  // POST /boleta/:id/iniciar-pago (autenticado, inicia sesión con la pasarela)
  router.post('/:id/iniciar-pago', autenticacionMiddleware, (req, res, next) => controller.iniciarPago(req, res, next));

  // POST /boleta/webhook-pago (público, llamado por la pasarela de pagos)
  router.post('/webhook-pago', validarCamposRequeridos(['orderId', 'status']), (req, res, next) => controller.procesarPagoWebhook(req, res, next));

  return router;
};
