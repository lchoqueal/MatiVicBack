const express = require('express');
const ReportesController = require('../controllers/ReportesController');
const autenticacionMiddleware = require('../../middleware/autenticacionMiddleware');

module.exports = (obtenerReportesApplicationService) => {
  const router = express.Router();
  const controller = new ReportesController(obtenerReportesApplicationService);

  // GET /reportes/ventas (requiere autenticación)
  router.get('/ventas', autenticacionMiddleware, (req, res, next) => controller.obtenerVentasPorPeriodo(req, res, next));

  // GET /reportes/productos-mas-vendidos (requiere autenticación)
  router.get('/productos-mas-vendidos', autenticacionMiddleware, (req, res, next) => controller.obtenerProductosMasVendidos(req, res, next));

  // GET /reportes/inventario (requiere autenticación)
  router.get('/inventario', autenticacionMiddleware, (req, res, next) => controller.obtenerInventario(req, res, next));

  return router;
};
