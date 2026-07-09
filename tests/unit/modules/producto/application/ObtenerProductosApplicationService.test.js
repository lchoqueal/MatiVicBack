const ObtenerProductosApplicationService = require('../../../../../src/modules/producto/application/ObtenerProductosApplicationService');

const crearProductoMock = (overrides = {}) => ({
  id: 1,
  nombre: 'Teclado',
  precio: { monto: 12000 },
  stock: { cantidad: 8 },
  minStock: 5,
  descripcion: 'Mecanico',
  imagenUrl: 'https://img.test/teclado.png',
  idCategoria: 2,
  tieneStockBajo: jest.fn(() => false),
  ...overrides
});

describe('ObtenerProductosApplicationService', () => {
  it('obtenerTodos retorna cantidad y productos serializados', async () => {
    const productos = [
      crearProductoMock(),
      crearProductoMock({
        id: 2,
        nombre: 'Mouse',
        tieneStockBajo: jest.fn(() => true)
      })
    ];
    const productoRepository = {
      obtenerTodos: jest.fn().mockResolvedValue(productos)
    };
    const service = new ObtenerProductosApplicationService(productoRepository);

    const resultado = await service.obtenerTodos();

    expect(productoRepository.obtenerTodos).toHaveBeenCalledTimes(1);
    expect(resultado.cantidad).toBe(2);
    expect(resultado.productos[0]).toMatchObject({
      id: 1,
      nombre: 'Teclado',
      precio: 12000,
      stock: 8,
      minStock: 5,
      tieneStockBajo: false
    });
    expect(resultado.productos[1].tieneStockBajo).toBe(true);
  });

  it('buscar usa el repositorio con el nombre recibido', async () => {
    const productoRepository = {
      buscarPorNombre: jest.fn().mockResolvedValue([crearProductoMock()])
    };
    const service = new ObtenerProductosApplicationService(productoRepository);

    const resultado = await service.buscar('teclado');

    expect(productoRepository.buscarPorNombre).toHaveBeenCalledWith('teclado');
    expect(resultado.cantidad).toBe(1);
  });

  it('obtenerStockBajo retorna lista serializada', async () => {
    const productoRepository = {
      obtenerStockBajo: jest.fn().mockResolvedValue([
        crearProductoMock({ stock: { cantidad: 1 }, minStock: 5, tieneStockBajo: jest.fn(() => true) })
      ])
    };
    const service = new ObtenerProductosApplicationService(productoRepository);

    const resultado = await service.obtenerStockBajo();

    expect(productoRepository.obtenerStockBajo).toHaveBeenCalledTimes(1);
    expect(resultado).toEqual({
      cantidad: 1,
      productos: [
        expect.objectContaining({
          stock: 1,
          minStock: 5,
          tieneStockBajo: true
        })
      ]
    });
  });

  it('obtenerMasVendidos respeta limite', async () => {
    const productoRepository = {
      obtenerMasVendidos: jest.fn().mockResolvedValue([crearProductoMock()])
    };
    const service = new ObtenerProductosApplicationService(productoRepository);

    const resultado = await service.obtenerMasVendidos(7);

    expect(productoRepository.obtenerMasVendidos).toHaveBeenCalledWith(7);
    expect(resultado.cantidad).toBe(1);
  });
});