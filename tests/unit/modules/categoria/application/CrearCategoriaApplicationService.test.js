const CrearCategoriaApplicationService = require('../../../../../src/modules/categoria/application/CrearCategoriaApplicationService');
const Categoria = require('../../../../../src/modules/categoria/domain/entities/Categoria');

describe('CrearCategoriaApplicationService', () => {
  test('ejecutar guarda la categoria y retorna la respuesta serializada', async () => {
    const categoriaRepository = {
      guardar: jest.fn().mockResolvedValue({
        id: 10,
        nombre: 'Bebidas',
        descripcion: 'Categoría de bebidas',
        orden: 2,
        estado: 'activo'
      })
    };
    const service = new CrearCategoriaApplicationService(categoriaRepository);

    const resultado = await service.ejecutar({
      nombre: 'Bebidas',
      descripcion: 'Categoría de bebidas',
      orden: 2
    });

    expect(categoriaRepository.guardar).toHaveBeenCalledWith(expect.any(Categoria));
    expect(resultado).toEqual({
      id: 10,
      nombre: 'Bebidas',
      descripcion: 'Categoría de bebidas',
      orden: 2,
      estado: 'activo'
    });
  });

  test('ejecutar falla si el nombre es vacío', async () => {
    const categoriaRepository = {
      guardar: jest.fn()
    };
    const service = new CrearCategoriaApplicationService(categoriaRepository);

    await expect(service.ejecutar({ nombre: '   ' })).rejects.toThrow('Nombre de categoría requerido');
  });

  test('ejecutar falla si el orden es negativo', async () => {
    const categoriaRepository = {
      guardar: jest.fn()
    };
    const service = new CrearCategoriaApplicationService(categoriaRepository);

    await expect(service.ejecutar({ nombre: 'Bebidas', orden: -1 })).rejects.toThrow('Orden debe ser positivo');
  });
});