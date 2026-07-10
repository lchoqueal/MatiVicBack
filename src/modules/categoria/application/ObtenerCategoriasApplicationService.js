/**
 * Application Service: ObtenerCategoriasApplicationService
 * Orquesta obtención de categorías
 */
class ObtenerCategoriasApplicationService {
  constructor(categoriaRepository) {
    this.categoriaRepository = categoriaRepository;
  }

  /**
   * Obtener todas las categorías
   */
  async obtenerTodas() {
    const categorias = await this.categoriaRepository.obtenerTodas();

    return {
      cantidad: categorias.length,
      categorias: categorias.map(c => this._serializarCategoria(c))
    };
  }

  /**
   * Buscar categorías por nombre
   */
  async buscar(nombre) {
    const categorias = await this.categoriaRepository.obtenerPorNombre(nombre);

    return {
      cantidad: categorias.length,
      categorias: categorias.map(c => this._serializarCategoria(c))
    };
  }

  /**
   * Serializar categoría para respuesta
   */
  _serializarCategoria(categoria) {
    return {
      id: categoria.id,
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
      orden: categoria.orden,
      estado: categoria.estado
    };
  }
}

module.exports = ObtenerCategoriasApplicationService;
