const ObtenerAlertasApplicationService = require('../../../../../src/modules/producto/application/ObtenerAlertasApplicationService');

describe('ObtenerAlertasApplicationService', () => {
  it('obtenerProductosStockBajo retorna alertas con urgencia calculada', async () => {
    const productoRepository = {
      obtenerStockBajo: jest.fn().mockResolvedValue([
        {
          id: 1,
          nombre: 'Teclado',
          stock: { cantidad: 2 },
          minStock: 8,
          precio: { monto: 12000 }
        }
      ])
    };
    const service = new ObtenerAlertasApplicationService(productoRepository);

    const resultado = await service.obtenerProductosStockBajo();

    expect(resultado).toEqual({
      cantidad: 1,
      alertas: [
        {
          idProducto: 1,
          nombre: 'Teclado',
          stockActual: 2,
          stockMinimo: 8,
          diferencia: 6,
          precio: 12000,
          urgencia: 5
        }
      ]
    });
  });

  it('emitirAlertaStockBajo lanza error si producto no existe', async () => {
    const productoRepository = {
      obtenerPorId: jest.fn().mockResolvedValue(null)
    };
    const service = new ObtenerAlertasApplicationService(productoRepository);

    await expect(service.emitirAlertaStockBajo(50)).rejects.toThrow('Producto no encontrado');
  });

  it('emitirAlertaStockBajo emite evento cuando hay stock bajo', async () => {
    const producto = {
      id: 5,
      nombre: 'Mouse',
      stock: { cantidad: 1 },
      minStock: 4,
      tieneStockBajo: jest.fn(() => true)
    };
    const productoRepository = {
      obtenerPorId: jest.fn().mockResolvedValue(producto)
    };
    const socketIOEmitter = {
      emitirAlertaStockBajo: jest.fn()
    };
    const service = new ObtenerAlertasApplicationService(productoRepository, socketIOEmitter);

    const resultado = await service.emitirAlertaStockBajo(5);

    expect(socketIOEmitter.emitirAlertaStockBajo).toHaveBeenCalledWith(producto);
    expect(resultado.mensaje).toBe('Alerta emitida exitosamente');
    expect(resultado.producto).toEqual({ id: 5, nombre: 'Mouse', stock: 1, minStock: 4 });
  });

  it('emitirAlertaStockBajo no emite evento si no hay stock bajo', async () => {
    const producto = {
      id: 7,
      nombre: 'Monitor',
      stock: { cantidad: 10 },
      minStock: 4,
      tieneStockBajo: jest.fn(() => false)
    };
    const productoRepository = {
      obtenerPorId: jest.fn().mockResolvedValue(producto)
    };
    const socketIOEmitter = {
      emitirAlertaStockBajo: jest.fn()
    };
    const service = new ObtenerAlertasApplicationService(productoRepository, socketIOEmitter);

    const resultado = await service.emitirAlertaStockBajo(7);

    expect(socketIOEmitter.emitirAlertaStockBajo).not.toHaveBeenCalled();
    expect(resultado.mensaje).toBe('Producto no tiene stock bajo');
  });
});