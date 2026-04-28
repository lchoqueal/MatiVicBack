const express = require('express');
const ReportesController = require('../controllers/ReportesController');
const autenticacionMiddleware = require('../../middleware/autenticacionMiddleware');
const { esAdministrador } = require('../../middleware/rolMiddleware');

module.exports = (obtenerReportesApplicationService) => {
  const router = express.Router();
  const controller = new ReportesController(obtenerReportesApplicationService);

  // GET /reportes/ventas (solo administrador)
  router.get('/ventas', autenticacionMiddleware, esAdministrador, (req, res, next) => controller.obtenerVentasPorPeriodo(req, res, next));

  // GET /reportes/productos-mas-vendidos (solo administrador)
  router.get('/productos-mas-vendidos', autenticacionMiddleware, esAdministrador, (req, res, next) => controller.obtenerProductosMasVendidos(req, res, next));

  // GET /reportes/inventario (solo administrador)
  router.get('/inventario', autenticacionMiddleware, esAdministrador, (req, res, next) => controller.obtenerInventario(req, res, next));

  return router;
};
