const EliminarProductoApplicationService = require('../../../../../src/modules/producto/application/EliminarProductoApplicationService');

describe('EliminarProductoApplicationService', () => {
  it('lanza error cuando producto no existe', async () => {
    const productoRepository = {
      obtenerPorId: jest.fn().mockResolvedValue(null),
      guardar: jest.fn()
    };
    const service = new EliminarProductoApplicationService(productoRepository);

    await expect(service.ejecutar({ idProducto: 10 })).rejects.toThrow('Producto no encontrado');
    expect(productoRepository.guardar).not.toHaveBeenCalled();
  });

  it('desactiva y guarda producto en flujo exitoso', async () => {
    const producto = {
      id: 10,
      nombre: 'Mouse',
      estado: 'activo',
      desactivar: jest.fn(function desactivar() {
        this.estado = 'inactivo';
      })
    };
    const productoRepository = {
      obtenerPorId: jest.fn().mockResolvedValue(producto),
      guardar: jest.fn().mockResolvedValue(undefined)
    };
    const service = new EliminarProductoApplicationService(productoRepository);

    const resultado = await service.ejecutar({ idProducto: 10 });

    expect(producto.desactivar).toHaveBeenCalledTimes(1);
    expect(productoRepository.guardar).toHaveBeenCalledWith(producto);
    expect(resultado).toEqual({
      idProducto: 10,
      nombre: 'Mouse',
      estado: 'inactivo',
      mensaje: 'Producto eliminado exitosamente'
    });
  });
});