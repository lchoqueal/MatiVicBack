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
    const { idProducto, nombre, precio, minStock, stock, descripcion, imagenUrl, idCategoria } = comando;

    // 1. Obtener producto existente
    const productoExistente = await this.productoRepository.obtenerPorId(idProducto);

    if (!productoExistente) {
      throw new Error('Producto no encontrado');
    }

    // 2. Actualizar atributos
    if (nombre) productoExistente.nombre = nombre;
    if (precio !== undefined) productoExistente.cambiarPrecio(precio);
    
    if (stock !== undefined || minStock !== undefined) {
      const Stock = require('../domain/valueObjects/Stock');
      const nuevaCantidad = stock !== undefined ? stock : productoExistente.stock.cantidad;
      const nuevoMinimo = minStock !== undefined ? minStock : productoExistente.minStock;
      
      productoExistente.stock = new Stock(nuevaCantidad, nuevoMinimo);
      productoExistente.minStock = parseInt(nuevoMinimo, 10);
    }
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
