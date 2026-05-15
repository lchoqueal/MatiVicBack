const express = require('express');
const AlertasController = require('../controllers/AlertasController');
const autenticacionMiddleware = require('../../../../shared/middleware/autenticacionMiddleware');
const { esAdministrador } = require('../../../../shared/middleware/rolMiddleware');

module.exports = (obtenerAlertasApplicationService) => {
  const router = express.Router();
  const controller = new AlertasController(obtenerAlertasApplicationService);

  // GET /alertas/stock-bajo (solo administrador)
  router.get('/stock-bajo', autenticacionMiddleware, esAdministrador, (req, res, next) => controller.obtenerProductosStockBajo(req, res, next));

  // POST /alertas/emitir-stock-bajo/:idProducto (solo administrador)
  router.post('/emitir-stock-bajo/:idProducto', autenticacionMiddleware, esAdministrador, (req, res, next) => controller.emitirAlertaStockBajo(req, res, next));

  return router;
};
