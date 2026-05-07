/**
 * Controller: ReportesController
 * Maneja reportes y análisis
 */
class ReportesController {
  constructor(obtenerReportesApplicationService) {
    this.obtenerReportesApplicationService = obtenerReportesApplicationService;
  }

  /**
   * GET /reportes/ventas
   */
  async obtenerVentasPorPeriodo(req, res, next) {
    try {
      const { fechaInicio, fechaFin } = req.query;

      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({
          success: false,
          codigo: 'PARAMETROS_AUSENTES',
          mensaje: 'fechaInicio y fechaFin son requeridos'
        });
      }

      const resultado = await this.obtenerReportesApplicationService.obtenerVentasPorPeriodo(
        new Date(fechaInicio),
        new Date(fechaFin)
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
   * GET /reportes/productos-mas-vendidos
   */
  async obtenerProductosMasVendidos(req, res, next) {
    try {
      const { limite } = req.query;

      const resultado = await this.obtenerReportesApplicationService.obtenerProductosMasVendidos(
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
   * GET /reportes/inventario
   */
  async obtenerInventario(req, res, next) {
    try {
      const resultado = await this.obtenerReportesApplicationService.obtenerInventario();

      return res.status(200).json({
        success: true,
        data: resultado
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ReportesController;
