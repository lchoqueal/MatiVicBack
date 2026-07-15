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

  /**
   * POST /boleta/:id/iniciar-pago
   * Llama a la pasarela para inicializar una sesión de pago y devuelve la URL de redirección.
   */
  async iniciarPago(req, res, next) {
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

      const PASARELA_URL = process.env.PASARELA_API_URL || 'http://localhost:4000/api/payments';
      const FRONT_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

      // Llamar a la pasarela para inicializar la sesión
      const pasarelaResponse = await fetch(`${PASARELA_URL}/initialize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: boleta.total?.monto ?? boleta.total,
          orderId: String(id),
          successUrl: `${FRONT_URL}/pago-exitoso?boleta=${id}`,
          failureUrl: `${FRONT_URL}/pago-fallido?boleta=${id}`
        })
      });

      const pasarelaData = await pasarelaResponse.json();

      if (!pasarelaResponse.ok || !pasarelaData.redirectUrl) {
        console.error('[iniciarPago] Error de pasarela:', pasarelaData);
        return res.status(502).json({
          success: false,
          codigo: 'PASARELA_ERROR',
          mensaje: 'No se pudo inicializar el pago con la pasarela'
        });
      }

      console.log(`[iniciarPago] Boleta ${id} → Token: ${pasarelaData.token} → URL: ${pasarelaData.redirectUrl}`);

      return res.status(200).json({
        success: true,
        data: {
          token: pasarelaData.token,
          redirectUrl: pasarelaData.redirectUrl
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /boleta/webhook-pago
   */
  async procesarPagoWebhook(req, res, next) {
    try {
      const { orderId, status } = req.body;

      console.log(`[Webhook Pago] Recibido callback de pasarela para Boleta ID: ${orderId}, Estado de pago: ${status}`);

      // Mapear estado de pasarela al estado del dominio de Boleta
      const nuevoEstado = status === 'paid' ? 'pagado' : 'cancelado';

      const resultado = await this.boletaRepository.actualizarEstado(parseInt(orderId), nuevoEstado);

      if (!resultado) {
        // Incrementar el contador de órdenes huérfanas críticas en Prometheus
        const { orphanOrdersTotal } = require('../../../../shared/infrastructure/monitoring/metrics');
        orphanOrdersTotal.inc({ order_id: orderId, status_pago: status });

        return res.status(404).json({
          success: false,
          codigo: 'BOLETA_NO_ENCONTRADA',
          mensaje: 'La boleta para la cual se reportó el pago no existe'
        });
      }

      console.log(`[Webhook Pago] Boleta ID: ${orderId} actualizada exitosamente a: ${nuevoEstado}`);

      return res.status(200).json({
        success: true,
        mensaje: 'Estado de pago actualizado vía webhook',
        data: {
          idBoleta: resultado.id_boleta,
          estado: resultado.estado_boleta
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BoletaController;
