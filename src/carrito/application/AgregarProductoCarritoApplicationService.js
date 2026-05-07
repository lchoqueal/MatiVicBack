/**
 * Application Service: AgregarProductoCarritoApplicationService
 * Orquesta agregación de producto al carrito
 */
class AgregarProductoCarritoApplicationService {
  constructor(carritoRepository, productoRepository, socketIOEmitter) {
    this.carritoRepository = carritoRepository;
    this.productoRepository = productoRepository;
    this.socketIOEmitter = socketIOEmitter;
  }

  /**
   * Ejecutar agregación de producto al carrito
   */
  async ejecutar(comando) {
    const { idCarrito, idProducto, cantidad } = comando;

    // 1. Validar cantidad
    if (cantidad <= 0) {
      throw new Error('Cantidad debe ser mayor a 0');
    }

    // 2. Obtener producto
    const producto = await this.productoRepository.obtenerPorId(idProducto);
    
    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    // 3. Validar que hay stock
    if (!producto.hayStockPara(cantidad)) {
      throw new Error(`Stock insuficiente. Disponible: ${producto.stock.cantidad}`);
    }

    // 4. Obtener carrito
    const carrito = await this.carritoRepository.obtenerPorId(idCarrito);
    
    if (!carrito) {
      throw new Error('Carrito no encontrado');
    }

    // 5. Agregar item al carrito
    carrito.agregarItem(producto, cantidad);

    // 6. Guardar carrito (actualiza items + recalcula total)
    await this.carritoRepository.guardar(carrito);

    // 7. Emitir evento de actualización de stock
    if (this.socketIOEmitter) {
      this.socketIOEmitter.emitirStockActualizado(producto);
    }

    return {
      idCarrito: carrito.id,
      cantidadItems: carrito.cantidadItems(),
      total: carrito.total.monto,
      mensaje: 'Producto agregado al carrito'
    };
  }
}

module.exports = AgregarProductoCarritoApplicationService;
