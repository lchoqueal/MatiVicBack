const ActualizarProductoApplicationService = require('../../../../../src/modules/producto/application/ActualizarProductoApplicationService');

const crearProducto = () => ({
  id: 1,
  nombre: 'Teclado',
  precio: { monto: 10000 },
  stock: { cantidad: 8 },
  minStock: 3,
  descripcion: 'Base',
  imagenUrl: 'img',
  idCategoria: 9,
  cambiarPrecio: jest.fn(function cambiarPrecio(valor) {
    this.precio = { monto: valor };
  }),
  validar: jest.fn()
});

describe('ActualizarProductoApplicationService', () => {
  it('lanza error cuando producto no existe', async () => {
    const productoRepository = {
      obtenerPorId: jest.fn().mockResolvedValue(null),
      guardar: jest.fn()
    };
    const service = new ActualizarProductoApplicationService(productoRepository);

    await expect(
      service.ejecutar({ idProducto: 99, nombre: 'Nuevo' })
    ).rejects.toThrow('Producto no encontrado');

    expect(productoRepository.guardar).not.toHaveBeenCalled();
  });

  it('actualiza, valida, guarda y emite evento en flujo exitoso', async () => {
    const producto = crearProducto();
    const productoRepository = {
      obtenerPorId: jest.fn().mockResolvedValue(producto),
      guardar: jest.fn().mockImplementation(async p => p)
    };
    const socketIOEmitter = {
      emitirStockActualizado: jest.fn()
    };
    const service = new ActualizarProductoApplicationService(productoRepository, socketIOEmitter);

    const resultado = await service.ejecutar({
      idProducto: 1,
      nombre: 'Teclado Pro',
      precio: 25000,
      minStock: 6,
      descripcion: 'Nuevo desc',
      imagenUrl: 'nueva-img',
      idCategoria: 12
    });

    expect(productoRepository.obtenerPorId).toHaveBeenCalledWith(1);
    expect(producto.cambiarPrecio).toHaveBeenCalledWith(25000);
    expect(producto.validar).toHaveBeenCalledTimes(1);
    expect(productoRepository.guardar).toHaveBeenCalledWith(producto);
    expect(socketIOEmitter.emitirStockActualizado).toHaveBeenCalledWith(producto);
    expect(resultado).toEqual({
      idProducto: 1,
      nombre: 'Teclado Pro',
      precio: 25000,
      stock: 8,
      minStock: 6,
      mensaje: 'Producto actualizado exitosamente'
    });
  });

  it('no emite evento si no se inyecta emitter', async () => {
    const producto = crearProducto();
    const productoRepository = {
      obtenerPorId: jest.fn().mockResolvedValue(producto),
      guardar: jest.fn().mockImplementation(async p => p)
    };
    const service = new ActualizarProductoApplicationService(productoRepository);

    await service.ejecutar({ idProducto: 1, nombre: 'Nombre 2' });

    expect(productoRepository.guardar).toHaveBeenCalledTimes(1);
  });
});