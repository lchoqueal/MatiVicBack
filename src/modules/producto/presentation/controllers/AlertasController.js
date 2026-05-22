/**
 * Controller: AlertasController
 * Maneja alertas del sistema
 */
class AlertasController {
  constructor(obtenerAlertasApplicationService) {
    this.obtenerAlertasApplicationService = obtenerAlertasApplicationService;
  }

  /**
   * GET /alertas/stock-bajo
   */
  async obtenerProductosStockBajo(req, res, next) {
    try {
      const resultado = await this.obtenerAlertasApplicationService.obtenerProductosStockBajo();

      return res.status(200).json({
        success: true,
        data: resultado
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /alertas/emitir-stock-bajo/:idProducto
   */
  async emitirAlertaStockBajo(req, res, next) {
    try {
      const { idProducto } = req.params;

      const resultado = await this.obtenerAlertasApplicationService.emitirAlertaStockBajo(
        parseInt(idProducto)
      );

      return res.status(200).json({
        success: true,
        data: resultado
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AlertasController;
