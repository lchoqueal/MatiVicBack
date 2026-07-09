/**
 * Controller: CategoriaController
 * Maneja categorías (listar, crear, buscar)
 */
class CategoriaController {
  constructor(
    obtenerCategoriasApplicationService,
    crearCategoriaApplicationService
  ) {
    this.obtenerCategoriasApplicationService = obtenerCategoriasApplicationService;
    this.crearCategoriaApplicationService = crearCategoriaApplicationService;
  }

  /**
   * GET /categorias
   */
  async obtenerTodas(req, res, next) {
    try {
      const resultado = await this.obtenerCategoriasApplicationService.obtenerTodas();

      return res.status(200).json({
        success: true,
        data: resultado
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /categorias/buscar
   */
  async buscar(req, res, next) {
    try {
      const { q } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          codigo: 'PARAMETRO_AUSENTE',
          mensaje: 'Parámetro "q" es requerido'
        });
      }

      const resultado = await this.obtenerCategoriasApplicationService.buscar(q);

      return res.status(200).json({
        success: true,
        data: resultado
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /categorias
   */
  async crear(req, res, next) {
    try {
      const { nombre, descripcion = '', orden = 1 } = req.body;

      const resultado = await this.crearCategoriaApplicationService.ejecutar({
        nombre,
        descripcion,
        orden
      });

      return res.status(201).json({
        success: true,
        data: resultado,
        message: 'Categoría creada exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoriaController;
