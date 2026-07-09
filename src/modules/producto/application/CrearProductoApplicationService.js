const Producto = require('../domain/entities/Producto');
const Precio = require('../../../shared/domain/valueObjects/Precio');

/**
 * Application Service: CrearProductoApplicationService
 * Orquesta la creación de un nuevo producto
 */
class CrearProductoApplicationService {
  constructor(productoRepository) {
    this.productoRepository = productoRepository;
  }

  async ejecutar({ nombre, stock, minStock, precio, descripcion = '', imagenUrl = '', idCategoria = null }) {
    // Validar datos de entrada
    if (!nombre || nombre.trim() === '') {
      throw new Error('Nombre de producto requerido');
    }

    if (!stock || stock < 0) {
      throw new Error('Stock inválido');
    }

    if (!minStock || minStock < 0) {
      throw new Error('Stock mínimo inválido');
    }

    if (!precio || precio <= 0) {
      throw new Error('Precio debe ser positivo');
    }

    // Crear entidad Producto
    const producto = new Producto(
      null,
      nombre,
      new Precio(precio),
      stock,
      minStock,
      descripcion,
      imagenUrl,
      idCategoria
    );

    // Validar agregado
    producto.validar();

    // Guardar en repositorio
    const productoGuardado = await this.productoRepository.guardar(producto);

    return productoGuardado;
  }
}

module.exports = CrearProductoApplicationService;
