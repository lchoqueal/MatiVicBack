const express = require('express');
const AlertasController = require('../controllers/AlertasController');
const autenticacionMiddleware = require('../../middleware/autenticacionMiddleware');

module.exports = (obtenerAlertasApplicationService) => {
  const router = express.Router();
  const controller = new AlertasController(obtenerAlertasApplicationService);

  // GET /alertas/stock-bajo
  router.get('/stock-bajo', (req, res, next) => controller.obtenerProductosStockBajo(req, res, next));

  // POST /alertas/emitir-stock-bajo/:idProducto (requiere autenticación)
  router.post('/emitir-stock-bajo/:idProducto', autenticacionMiddleware, (req, res, next) => controller.emitirAlertaStockBajo(req, res, next));

  return router;
};
