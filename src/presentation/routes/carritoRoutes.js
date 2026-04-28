const express = require('express');
const CarritoController = require('../controllers/CarritoController');
const autenticacionMiddleware = require('../../middleware/autenticacionMiddleware');
const { validarCamposRequeridos, validarPositivo } = require('../../middleware/validacionMiddleware');

module.exports = (
  agregarProductoCarritoApplicationService,
  carritoRepository
) => {
  const router = express.Router();
  const controller = new CarritoController(
    agregarProductoCarritoApplicationService,
    carritoRepository
  );

  // POST /carritos (requiere autenticación)
  router.post('/', autenticacionMiddleware, validarCamposRequeridos(['tipoCarrito']), (req, res, next) => controller.crear(req, res, next));

  // GET /carritos/:id
  router.get('/:id', (req, res, next) => controller.obtenerPorId(req, res, next));

  // POST /carritos/:id/items (requiere autenticación)
  router.post('/:id/items', autenticacionMiddleware, validarCamposRequeridos(['idProducto', 'cantidad']), validarPositivo('cantidad'), (req, res, next) => controller.agregarItem(req, res, next));

  // DELETE /carritos/:id/items/:idProducto (requiere autenticación)
  router.delete('/:id/items/:idProducto', autenticacionMiddleware, (req, res, next) => controller.eliminarItem(req, res, next));

  // DELETE /carritos/:id (requiere autenticación)
  router.delete('/:id', autenticacionMiddleware, (req, res, next) => controller.vaciar(req, res, next));

  return router;
};
