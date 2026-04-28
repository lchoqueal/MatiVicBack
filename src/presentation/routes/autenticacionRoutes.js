const express = require('express');
const AutenticacionController = require('../controllers/AutenticacionController');

module.exports = (autenticacionApplicationService) => {
  const router = express.Router();
  const controller = new AutenticacionController(autenticacionApplicationService);

  // POST /auth/login
  router.post('/login', (req, res, next) => controller.login(req, res, next));

  // POST /auth/registro
  router.post('/registro', (req, res, next) => controller.registro(req, res, next));

  // POST /auth/verificar-token
  router.post('/verificar-token', (req, res, next) => controller.verificarToken(req, res, next));

  return router;
};
