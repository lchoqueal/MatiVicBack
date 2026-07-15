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
      id_producto: producto.id, // Compatibilidad con el front
      nombre: producto.nombre,
      precio: producto.precio.monto,
      precio_unit: producto.precio.monto, // Compatibilidad con el front
      stock: producto.stock.cantidad,
      minStock: producto.minStock,
      min_stock: producto.minStock, // Compatibilidad con el front
      descripcion: producto.descripcion,
      imagenUrl: producto.imagenUrl,
      imagen_url: producto.imagenUrl, // Compatibilidad con el front
      idCategoria: producto.idCategoria,
      categoria: producto.categoria, // Nombre de texto de la categoría
      tieneStockBajo: producto.tieneStockBajo()
    };
  }
}

module.exports = ObtenerProductosApplicationService;
