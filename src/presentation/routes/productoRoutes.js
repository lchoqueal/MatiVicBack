const express = require('express');
const ProductoController = require('../controllers/ProductoController');
const autenticacionMiddleware = require('../../middleware/autenticacionMiddleware');
const { validarPositivo } = require('../../middleware/validacionMiddleware');

module.exports = (
  obtenerProductosApplicationService,
  actualizarProductoApplicationService,
  eliminarProductoApplicationService
) => {
  const router = express.Router();
  const controller = new ProductoController(
    obtenerProductosApplicationService,
    actualizarProductoApplicationService,
    eliminarProductoApplicationService
  );

  // GET /productos/buscar (DEBE ir antes de /:id)
  router.get('/buscar', (req, res, next) => controller.buscar(req, res, next));

  // GET /productos/stock-bajo
  router.get('/stock-bajo', (req, res, next) => controller.obtenerStockBajo(req, res, next));

  // GET /productos/mas-vendidos
  router.get('/mas-vendidos', (req, res, next) => controller.obtenerMasVendidos(req, res, next));

  // GET /productos
  router.get('/', (req, res, next) => controller.obtenerTodos(req, res, next));

  // PUT /productos/:id (requiere autenticación)
  router.put('/:id', autenticacionMiddleware, validarPositivo('precio'), (req, res, next) => controller.actualizar(req, res, next));

  // DELETE /productos/:id (requiere autenticación)
  router.delete('/:id', autenticacionMiddleware, (req, res, next) => controller.eliminar(req, res, next));

  return router;
};
