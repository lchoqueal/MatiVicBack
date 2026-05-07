/**
 * Application Service: ObtenerProductosApplicationService
 * Orquesta obtención de productos con filtros
 */
class ObtenerProductosApplicationService {
  constructor(productoRepository) {
    this.productoRepository = productoRepository;
  }

  /**
   * Obtener todos los productos
   */
  async obtenerTodos() {
    const productos = await this.productoRepository.obtenerTodos();

    return {
      cantidad: productos.length,
      productos: productos.map(p => this._serializarProducto(p))
    };
  }

  /**
   * Buscar productos por nombre
   */
  async buscar(nombre) {
    const productos = await this.productoRepository.buscarPorNombre(nombre);

    return {
      cantidad: productos.length,
      productos: productos.map(p => this._serializarProducto(p))
    };
  }

  /**
   * Obtener productos con stock bajo
   */
  async obtenerStockBajo() {
    const productos = await this.productoRepository.obtenerStockBajo();

    return {
      cantidad: productos.length,
      productos: productos.map(p => this._serializarProducto(p))
    };
  }

  /**
   * Obtener productos más vendidos
   */
  async obtenerMasVendidos(limite = 10) {
    const productos = await this.productoRepository.obtenerMasVendidos(limite);

    return {
      cantidad: productos.length,
      productos: productos.map(p => this._serializarProducto(p))
    };
  }

  /**
   * Serializar producto para respuesta
   */
  _serializarProducto(producto) {
    return {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio.monto,
      stock: producto.stock.cantidad,
      minStock: producto.minStock,
      descripcion: producto.descripcion,
      imagenUrl: producto.imagenUrl,
      idCategoria: producto.idCategoria,
      tieneStockBajo: producto.tieneStockBajo()
    };
  }
}

module.exports = ObtenerProductosApplicationService;
