const Categoria = require('../domain/entities/Categoria');

/**
 * Application Service: CrearCategoriaApplicationService
 * Orquesta la creación de una nueva categoría
 */
class CrearCategoriaApplicationService {
  constructor(categoriaRepository) {
    this.categoriaRepository = categoriaRepository;
  }

  async ejecutar({ nombre, descripcion = '', orden = 1 }) {
    // Validar datos de entrada
    if (!nombre || nombre.trim() === '') {
      throw new Error('Nombre de categoría requerido');
    }

    if (orden < 0) {
      throw new Error('Orden debe ser positivo');
    }

    // Crear entidad Categoria
    const categoria = new Categoria(
      null,
      nombre,
      descripcion,
      orden,
      'activo'
    );

    // Validar agregado
    categoria.validar();

    // Guardar en repositorio
    const categoriaGuardada = await this.categoriaRepository.guardar(categoria);

    return {
      id: categoriaGuardada.id,
      nombre: categoriaGuardada.nombre,
      descripcion: categoriaGuardada.descripcion,
      orden: categoriaGuardada.orden,
      estado: categoriaGuardada.estado
    };
  }
}

module.exports = CrearCategoriaApplicationService;
