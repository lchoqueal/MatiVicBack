/**
 * Controller: BoletaController
 * Maneja boletas (crear, obtener, etc.)
 */
class BoletaController {
  constructor(
    crearBoletaApplicationService,
    boletaRepository
  ) {
    this.crearBoletaApplicationService = crearBoletaApplicationService;
    this.boletaRepository = boletaRepository;
  }

  /**
   * POST /boletas
   */
  async crear(req, res, next) {
    try {
      const {
        idCarrito,
        tipoVenta,
        metodoPago,
        idCliente,
        idEmpleado,
        idLocal
      } = req.body;

      if (!idCarrito || !tipoVenta || !metodoPago) {
        return res.status(400).json({
          success: false,
          codigo: 'DATOS_INCOMPLETOS',
          mensaje: 'Datos incompletos para crear boleta'
        });
      }

      const resultado = await this.crearBoletaApplicationService.ejecutar({
        idCarrito,
        tipoVenta,
        metodoPago,
        idCliente,
        idEmpleado,
        idLocal
      });

      return res.status(201).json({
        success: true,
        data: resultado
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /boletas/:id
   */
  async obtenerPorId(req, res, next) {
    try {
      const { id } = req.params;

      const boleta = await this.boletaRepository.obtenerPorId(parseInt(id));

      if (!boleta) {
        return res.status(404).json({
          success: false,
          codigo: 'BOLETA_NO_ENCONTRADA',
          mensaje: 'Boleta no encontrada'
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          idBoleta: boleta.id,
          tipoVenta: boleta.tipoVenta.toString(),
          total: boleta.total.monto,
          metodoPago: boleta.metodoPago,
          estado: boleta.estado,
          fechaEmision: boleta.fechaEmision
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /boletas/cliente/:idCliente
   */
  async obtenerPorCliente(req, res, next) {
    try {
      const { idCliente } = req.params;

      const boletas = await this.boletaRepository.obtenerPorCliente(parseInt(idCliente));

      return res.status(200).json({
        success: true,
        data: {
          cantidad: boletas.length,
          boletas: boletas.map(b => ({
            idBoleta: b.id,
            tipoVenta: b.tipoVenta.toString(),
            total: b.total.monto,
            estado: b.estado,
            fechaEmision: b.fechaEmision
          }))
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /boletas/empleado/:idEmpleado
   */
  async obtenerPorEmpleado(req, res, next) {
    try {
      const { idEmpleado } = req.params;

      const boletas = await this.boletaRepository.obtenerPorEmpleado(parseInt(idEmpleado));

      return res.status(200).json({
        success: true,
        data: {
          cantidad: boletas.length,
          boletas: boletas.map(b => ({
            idBoleta: b.id,
            tipoVenta: b.tipoVenta.toString(),
            total: b.total.monto,
            estado: b.estado,
            fechaEmision: b.fechaEmision
          }))
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /boletas/:id/estado
   */
  async actualizarEstado(req, res, next) {
    try {
      const { id } = req.params;
      const { nuevoEstado } = req.body;

      if (!nuevoEstado) {
        return res.status(400).json({
          success: false,
          codigo: 'DATOS_INCOMPLETOS',
          mensaje: 'nuevoEstado es requerido'
        });
      }

      const resultado = await this.boletaRepository.actualizarEstado(parseInt(id), nuevoEstado);

      if (!resultado) {
        return res.status(404).json({
          success: false,
          codigo: 'BOLETA_NO_ENCONTRADA',
          mensaje: 'Boleta no encontrada'
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          idBoleta: resultado.id_boleta,
          estado: resultado.estado_boleta,
          mensaje: 'Estado actualizado'
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BoletaController;
