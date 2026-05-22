/**
 * Application Service: ActualizarProductoApplicationService
 * Orquesta actualización de productos (admin)
 */
class ActualizarProductoApplicationService {
  constructor(productoRepository, socketIOEmitter) {
    this.productoRepository = productoRepository;
    this.socketIOEmitter = socketIOEmitter;
  }

  /**
   * Ejecutar actualización de producto
   */
  async ejecutar(comando) {
    const { idProducto, nombre, precio, minStock, descripcion, imagenUrl, idCategoria } = comando;

    // 1. Obtener producto existente
    const productoExistente = await this.productoRepository.obtenerPorId(idProducto);

    if (!productoExistente) {
      throw new Error('Producto no encontrado');
    }

    // 2. Actualizar atributos
    if (nombre) productoExistente.nombre = nombre;
    if (precio) productoExistente.cambiarPrecio(precio);
    if (minStock) productoExistente.minStock = minStock;
    if (descripcion) productoExistente.descripcion = descripcion;
    if (imagenUrl) productoExistente.imagenUrl = imagenUrl;
    if (idCategoria) productoExistente.idCategoria = idCategoria;

    // 3. Validar
    productoExistente.validar();

    // 4. Guardar
    const actualizado = await this.productoRepository.guardar(productoExistente);

    // 5. Emitir evento
    if (this.socketIOEmitter) {
      this.socketIOEmitter.emitirStockActualizado(actualizado);
    }

    return {
      idProducto: actualizado.id,
      nombre: actualizado.nombre,
      precio: actualizado.precio.monto,
      stock: actualizado.stock.cantidad,
      minStock: actualizado.minStock,
      mensaje: 'Producto actualizado exitosamente'
    };
  }
}

module.exports = ActualizarProductoApplicationService;
