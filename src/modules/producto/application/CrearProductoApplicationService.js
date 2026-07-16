const Producto = require('../domain/entities/Producto');

/**
 * Application Service: CrearProductoApplicationService
 * Orquesta la creación de un nuevo producto
 */
class CrearProductoApplicationService {
  constructor(productoRepository, socketIOEmitter) {
    this.productoRepository = productoRepository;
    this.socketIOEmitter = socketIOEmitter;
  }

  async ejecutar(comando) {
    const { nombre, precio, stock, minStock, descripcion, imagenUrl, idCategoria, idLocal } = comando;

    // Crear la entidad
    const nuevoProducto = new Producto(
      null,
      nombre,
      precio,
      stock ?? 0,
      minStock ?? 5,
      descripcion ?? '',
      imagenUrl ?? '',
      idCategoria ?? null
    );

    // Guardar idLocal si viene (para el repositorio)
    nuevoProducto.idLocal = idLocal ?? null;

    // Validar reglas de negocio
    nuevoProducto.validar();

    // Persistir
    const guardado = await this.productoRepository.guardar(nuevoProducto);

    // Emitir evento de stock si hay emisor
    if (this.socketIOEmitter) {
      this.socketIOEmitter.emitirStockActualizado(guardado);
    }

    return {
      idProducto: guardado.id,
      nombre: guardado.nombre,
      precio: guardado.precio.monto,
      stock: guardado.stock.cantidad,
      minStock: guardado.minStock,
      mensaje: 'Producto creado exitosamente'
    };
  }
}

module.exports = CrearProductoApplicationService;
