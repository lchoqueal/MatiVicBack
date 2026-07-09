const ObtenerCategoriasApplicationService = require('../../../../../src/modules/categoria/application/ObtenerCategoriasApplicationService');

describe('ObtenerCategoriasApplicationService', () => {
  test('obtenerTodas serializa todas las categorias', async () => {
    const categoriaRepository = {
      obtenerTodas: jest.fn().mockResolvedValue([
        { id: 1, nombre: 'Bebidas', descripcion: 'Agua y gaseosas', orden: 1, estado: 'activo' },
        { id: 2, nombre: 'Snacks', descripcion: 'Papas y golosinas', orden: 2, estado: 'inactivo' }
      ])
    };
    const service = new ObtenerCategoriasApplicationService(categoriaRepository);

    const resultado = await service.obtenerTodas();

    expect(categoriaRepository.obtenerTodas).toHaveBeenCalledTimes(1);
    expect(resultado).toEqual({
      cantidad: 2,
      categorias: [
        { id: 1, nombre: 'Bebidas', descripcion: 'Agua y gaseosas', orden: 1, estado: 'activo' },
        { id: 2, nombre: 'Snacks', descripcion: 'Papas y golosinas', orden: 2, estado: 'inactivo' }
      ]
    });
  });

  test('buscar usa el repositorio con el nombre recibido y serializa la respuesta', async () => {
    const categoriaRepository = {
      obtenerPorNombre: jest.fn().mockResolvedValue([
        { id: 3, nombre: 'Lácteos', descripcion: 'Leche y yogur', orden: 3, estado: 'activo' }
      ])
    };
    const service = new ObtenerCategoriasApplicationService(categoriaRepository);

    const resultado = await service.buscar('Lácteos');

    expect(categoriaRepository.obtenerPorNombre).toHaveBeenCalledWith('Lácteos');
    expect(resultado).toEqual({
      cantidad: 1,
      categorias: [
        { id: 3, nombre: 'Lácteos', descripcion: 'Leche y yogur', orden: 3, estado: 'activo' }
      ]
    });
  });
});