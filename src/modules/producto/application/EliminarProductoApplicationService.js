/**
 * Application Service: EliminarProductoApplicationService
 * Orquesta eliminación lógica de productos (admin)
 */
class EliminarProductoApplicationService {
  constructor(productoRepository) {
    this.productoRepository = productoRepository;
  }

  /**
   * Ejecutar eliminación lógica de producto
   */
  async ejecutar(comando) {
    const { idProducto } = comando;

    // 1. Obtener producto
    const producto = await this.productoRepository.obtenerPorId(idProducto);

    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    // 2. Desactivar producto
    producto.desactivar();

    // 3. Guardar cambio
    await this.productoRepository.guardar(producto);

    return {
      idProducto: producto.id,
      nombre: producto.nombre,
      estado: producto.estado,
      mensaje: 'Producto eliminado exitosamente'
    };
  }
}

module.exports = EliminarProductoApplicationService;
