const express = require('express');
const AutenticacionController = require('../controllers/AutenticacionController');
const autenticacionMiddleware = require('../../../../shared/middleware/autenticacionMiddleware');
const { esAdministrador } = require('../../../../shared/middleware/rolMiddleware');

module.exports = (autenticacionApplicationService) => {
  const router = express.Router();
  const controller = new AutenticacionController(autenticacionApplicationService);

  // POST /auth/login (publico)
  router.post('/login', (req, res, next) => controller.login(req, res, next));

  // POST /auth/registro (publico - cliente)
  router.post('/registro', (req, res, next) => controller.registro(req, res, next));

  // POST /auth/empleados (protegida - solo admin)
  router.post('/empleados', 
    autenticacionMiddleware, 
    esAdministrador,
    (req, res, next) => controller.crearEmpleado(req, res, next)
  );

  // POST /auth/verificar-token
  router.post('/verificar-token', (req, res, next) => controller.verificarToken(req, res, next));

  return router;
};
