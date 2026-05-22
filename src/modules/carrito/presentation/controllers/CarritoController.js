/**
 * Controller: CarritoController
 * Maneja carritos (crear, agregar items, etc.)
 */
class CarritoController {
  constructor(
    agregarProductoCarritoApplicationService,
    carritoRepository
  ) {
    this.agregarProductoCarritoApplicationService = agregarProductoCarritoApplicationService;
    this.carritoRepository = carritoRepository;
  }

  /**
   * POST /carritos
   */
  async crear(req, res, next) {
    try {
      const { tipoCarrito, idCliente, idEmpleado } = req.body;

      if (!tipoCarrito || (tipoCarrito === 'cliente' && !idCliente) || (tipoCarrito === 'venta_fisica' && !idEmpleado)) {
        return res.status(400).json({
          success: false,
          codigo: 'DATOS_INCOMPLETOS',
          mensaje: 'Datos incompletos para crear carrito'
        });
      }

      const idCarrito = await this.carritoRepository.crear(
        tipoCarrito,
        idCliente,
        idEmpleado
      );

      return res.status(201).json({
        success: true,
        data: {
          idCarrito,
          tipoCarrito,
          mensaje: 'Carrito creado exitosamente'
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /carritos/:id
   */
  async obtenerPorId(req, res, next) {
    try {
      const { id } = req.params;

      const carrito = await this.carritoRepository.obtenerPorId(parseInt(id));

      if (!carrito) {
        return res.status(404).json({
          success: false,
          codigo: 'CARRITO_NO_ENCONTRADO',
          mensaje: 'Carrito no encontrado'
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          idCarrito: carrito.id,
          tipoCarrito: carrito.tipoCarrito,
          total: carrito.total.monto,
          cantidadItems: carrito.cantidadItems(),
          items: carrito.items
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /carritos/:id/items
   */
  async agregarItem(req, res, next) {
    try {
      const { id } = req.params;
      const { idProducto, cantidad } = req.body;

      if (!idProducto || !cantidad) {
        return res.status(400).json({
          success: false,
          codigo: 'DATOS_INCOMPLETOS',
          mensaje: 'idProducto y cantidad son requeridos'
        });
      }

      const resultado = await this.agregarProductoCarritoApplicationService.ejecutar({
        idCarrito: parseInt(id),
        idProducto,
        cantidad
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
   * DELETE /carritos/:id/items/:idProducto
   */
  async eliminarItem(req, res, next) {
    try {
      const { id, idProducto } = req.params;

      await this.carritoRepository.eliminarItem(parseInt(id), parseInt(idProducto));

      return res.status(200).json({
        success: true,
        mensaje: 'Item eliminado del carrito'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /carritos/:id
   */
  async vaciar(req, res, next) {
    try {
      const { id } = req.params;

      await this.carritoRepository.vaciar(parseInt(id));

      return res.status(200).json({
        success: true,
        mensaje: 'Carrito vaciado'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CarritoController;
