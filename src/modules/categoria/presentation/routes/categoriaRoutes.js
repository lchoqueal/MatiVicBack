const express = require('express');
const CategoriaController = require('../controllers/CategoriaController');
const autenticacionMiddleware = require('../../../../shared/middleware/autenticacionMiddleware');
const { esAdministrador } = require('../../../../shared/middleware/rolMiddleware');

module.exports = (
  obtenerCategoriasApplicationService,
  crearCategoriaApplicationService
) => {
  const router = express.Router();
  const controller = new CategoriaController(
    obtenerCategoriasApplicationService,
    crearCategoriaApplicationService
  );

  // GET /categorias/buscar (DEBE ir antes de /:id o POST)
  router.get('/buscar', (req, res, next) => controller.buscar(req, res, next));

  // GET /categorias (público)
  router.get('/', (req, res, next) => controller.obtenerTodas(req, res, next));

  // POST /categorias (requiere administrador)
  router.post('/', autenticacionMiddleware, esAdministrador, (req, res, next) => controller.crear(req, res, next));

  return router;
};
