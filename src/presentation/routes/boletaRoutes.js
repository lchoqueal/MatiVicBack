const express = require('express');
const BoletaController = require('../controllers/BoletaController');
const autenticacionMiddleware = require('../../middleware/autenticacionMiddleware');
const { esAdministradorOEmpleado, esAdministrador } = require('../../middleware/rolMiddleware');
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

  // POST /boletas (requiere administrador o empleado)
  router.post('/', autenticacionMiddleware, esAdministradorOEmpleado, validarCamposRequeridos(['idCarrito', 'tipoVenta', 'metodoPago']), (req, res, next) => controller.crear(req, res, next));

  // GET /boletas/cliente/:idCliente (ANTES de /:id)
  router.get('/cliente/:idCliente', autenticacionMiddleware, (req, res, next) => controller.obtenerPorCliente(req, res, next));

  // GET /boletas/empleado/:idEmpleado (ANTES de /:id)
  router.get('/empleado/:idEmpleado', autenticacionMiddleware, esAdministrador, (req, res, next) => controller.obtenerPorEmpleado(req, res, next));

  // GET /boletas/:id (dinámica, va después)
  router.get('/:id', autenticacionMiddleware, (req, res, next) => controller.obtenerPorId(req, res, next));

  // PUT /boletas/:id/estado (requiere administrador o empleado)
  router.put('/:id/estado', autenticacionMiddleware, esAdministradorOEmpleado, validarCamposRequeridos(['nuevoEstado']), (req, res, next) => controller.actualizarEstado(req, res, next));

  return router;
};
