/**
 * Application Service: ObtenerReportesApplicationService
 * Orquesta reportes y análisis de ventas
 */
class ObtenerReportesApplicationService {
  constructor(boletaRepository, productoRepository) {
    this.boletaRepository = boletaRepository;
    this.productoRepository = productoRepository;
  }

  /**
   * Obtener ventas por período
   */
  async obtenerVentasPorPeriodo(fechaInicio, fechaFin) {
    const boletasPagadas = await this.boletaRepository.obtenerPagadas(fechaInicio, fechaFin);
    const totalVentas = await this.boletaRepository.obtenerTotalVentas(fechaInicio, fechaFin);

    const cantidadVentas = boletasPagadas.length;
    const promedioVenta = cantidadVentas > 0 ? totalVentas / cantidadVentas : 0;

    return {
      fechaInicio,
      fechaFin,
      cantidadVentas,
      totalVentas,
      promedioVenta,
      boletas: boletasPagadas.map(b => this._serializarBoleta(b))
    };
  }

  /**
   * Obtener productos más vendidos
   */
  async obtenerProductosMasVendidos(limite = 10) {
    const productos = await this.productoRepository.obtenerMasVendidos(limite);

    return {
      cantidad: productos.length,
      productos: productos.map(p => ({
        id: p.id,
        nombre: p.nombre,
        cantidadVendida: p.cantidad_vendida || 0,
        precio: p.precio.monto
      }))
    };
  }

  /**
   * Obtener inventario actual
   */
  async obtenerInventario() {
    const productos = await this.productoRepository.obtenerTodos();

    const totalValor = productos.reduce((acc, p) => {
      return acc + (p.precio.monto * p.stock.cantidad);
    }, 0);

    const productosBajo = productos.filter(p => p.tieneStockBajo()).length;

    return {
      totalProductos: productos.length,
      totalValorInventario: totalValor,
      productosBajo,
      productos: productos.map(p => ({
        id: p.id,
        nombre: p.nombre,
        stock: p.stock.cantidad,
        minStock: p.minStock,
        precio: p.precio.monto,
        valorTotal: p.precio.monto * p.stock.cantidad,
        tieneStockBajo: p.tieneStockBajo()
      }))
    };
  }

  /**
   * Serializar boleta para respuesta
   */
  _serializarBoleta(boleta) {
    return {
      id: boleta.id,
      tipoVenta: boleta.tipoVenta.toString(),
      total: boleta.total.monto,
      metodoPago: boleta.metodoPago,
      estado: boleta.estado,
      fechaEmision: boleta.fechaEmision
    };
  }
}

module.exports = ObtenerReportesApplicationService;
