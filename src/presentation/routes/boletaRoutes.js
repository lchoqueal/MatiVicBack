const express = require('express');
const BoletaController = require('../controllers/BoletaController');
const autenticacionMiddleware = require('../../middleware/autenticacionMiddleware');
const { validarCamposRequeridos } = require('../../middleware/validacionMiddleware');

module.exports = (
  crearBoletaApplicationService,
  boletaRepository
) => {
  const router = express.Router();
  const controller = new BoletaController(
    crearBoletaApplicationService,
    boletaRepository
  );

  // POST /boletas (requiere autenticación + validación)
  router.post('/', autenticacionMiddleware, validarCamposRequeridos(['idCarrito', 'tipoVenta', 'metodoPago']), (req, res, next) => controller.crear(req, res, next));

  // GET /boletas/cliente/:idCliente (ANTES de /:id)
  router.get('/cliente/:idCliente', (req, res, next) => controller.obtenerPorCliente(req, res, next));

  // GET /boletas/empleado/:idEmpleado (ANTES de /:id)
  router.get('/empleado/:idEmpleado', (req, res, next) => controller.obtenerPorEmpleado(req, res, next));

  // GET /boletas/:id (dinámica, va después)
  router.get('/:id', (req, res, next) => controller.obtenerPorId(req, res, next));

  // PUT /boletas/:id/estado (requiere autenticación)
  router.put('/:id/estado', autenticacionMiddleware, validarCamposRequeridos(['nuevoEstado']), (req, res, next) => controller.actualizarEstado(req, res, next));

  return router;
};
