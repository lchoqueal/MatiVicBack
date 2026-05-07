/**
 * Controller: ProductoController
 * Maneja productos (listar, buscar, stock bajo, etc.)
 */
class ProductoController {
  constructor(
    obtenerProductosApplicationService,
    actualizarProductoApplicationService,
    eliminarProductoApplicationService
  ) {
    this.obtenerProductosApplicationService = obtenerProductosApplicationService;
    this.actualizarProductoApplicationService = actualizarProductoApplicationService;
    this.eliminarProductoApplicationService = eliminarProductoApplicationService;
  }

  /**
   * GET /productos
   */
  async obtenerTodos(req, res, next) {
    try {
      const resultado = await this.obtenerProductosApplicationService.obtenerTodos();

      return res.status(200).json({
        success: true,
        data: resultado
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /productos/buscar
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

      const resultado = await this.obtenerProductosApplicationService.buscar(q);

      return res.status(200).json({
        success: true,
        data: resultado
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /productos/stock-bajo
   */
  async obtenerStockBajo(req, res, next) {
    try {
      const resultado = await this.obtenerProductosApplicationService.obtenerStockBajo();

      return res.status(200).json({
        success: true,
        data: resultado
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /productos/mas-vendidos
   */
  async obtenerMasVendidos(req, res, next) {
    try {
      const { limite } = req.query;
      const resultado = await this.obtenerProductosApplicationService.obtenerMasVendidos(
        limite ? parseInt(limite) : 10
      );

      return res.status(200).json({
        success: true,
        data: resultado
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /productos/:id
   */
  async actualizar(req, res, next) {
    try {
      const { id } = req.params;
      const { nombre, precio, minStock, descripcion, imagenUrl, idCategoria } = req.body;

      const resultado = await this.actualizarProductoApplicationService.ejecutar({
        idProducto: parseInt(id),
        nombre,
        precio,
        minStock,
        descripcion,
        imagenUrl,
        idCategoria
      });

      return res.status(200).json({
        success: true,
        data: resultado
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /productos/:id
   */
  async eliminar(req, res, next) {
    try {
      const { id } = req.params;

      const resultado = await this.eliminarProductoApplicationService.ejecutar({
        idProducto: parseInt(id)
      });

      return res.status(200).json({
        success: true,
        data: resultado
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductoController;
