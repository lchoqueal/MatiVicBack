/**
 * Application Service: ObtenerAlertasApplicationService
 * Orquesta alertas del sistema (stock bajo, etc.)
 */
class ObtenerAlertasApplicationService {
  constructor(productoRepository, socketIOEmitter) {
    this.productoRepository = productoRepository;
    this.socketIOEmitter = socketIOEmitter;
  }

  /**
   * Obtener productos con stock bajo
   */
  async obtenerProductosStockBajo() {
    const productos = await this.productoRepository.obtenerStockBajo();

    return {
      cantidad: productos.length,
      alertas: productos.map(p => ({
        idProducto: p.id,
        nombre: p.nombre,
        stockActual: p.stock.cantidad,
        stockMinimo: p.minStock,
        diferencia: p.minStock - p.stock.cantidad,
        precio: p.precio.monto,
        urgencia: this._calcularUrgencia(p)
      }))
    };
  }

  /**
   * Emitir alerta de stock bajo
   */
  async emitirAlertaStockBajo(idProducto) {
    const producto = await this.productoRepository.obtenerPorId(idProducto);

    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    if (producto.tieneStockBajo() && this.socketIOEmitter) {
      this.socketIOEmitter.emitirAlertaStockBajo(producto);

      return {
        mensaje: 'Alerta emitida exitosamente',
        producto: {
          id: producto.id,
          nombre: producto.nombre,
          stock: producto.stock.cantidad,
          minStock: producto.minStock
        }
      };
    }

    return {
      mensaje: 'Producto no tiene stock bajo',
      producto: {
        id: producto.id,
        nombre: producto.nombre,
        stock: producto.stock.cantidad,
        minStock: producto.minStock
      }
    };
  }

  /**
   * Calcular nivel de urgencia (1-5)
   */
  _calcularUrgencia(producto) {
    const porcentaje = (producto.stock.cantidad / producto.minStock) * 100;

    if (porcentaje === 0) return 5;
    if (porcentaje <= 25) return 5;
    if (porcentaje <= 50) return 4;
    if (porcentaje <= 75) return 3;
    return 2;
  }
}

module.exports = ObtenerAlertasApplicationService;
