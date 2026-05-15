const ProductoController = require('../../../../../src/modules/producto/presentation/controllers/ProductoController');

const crearRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('ProductoController', () => {
  let obtenerProductosApplicationService;
  let actualizarProductoApplicationService;
  let eliminarProductoApplicationService;
  let controller;

  beforeEach(() => {
    obtenerProductosApplicationService = {
      obtenerTodos: jest.fn(),
      buscar: jest.fn(),
      obtenerStockBajo: jest.fn(),
      obtenerMasVendidos: jest.fn()
    };
    actualizarProductoApplicationService = { ejecutar: jest.fn() };
    eliminarProductoApplicationService = { ejecutar: jest.fn() };

    controller = new ProductoController(
      obtenerProductosApplicationService,
      actualizarProductoApplicationService,
      eliminarProductoApplicationService
    );
  });

  it('obtenerTodos responde 200 con success true', async () => {
    const req = {};
    const res = crearRes();
    const next = jest.fn();
    const data = { cantidad: 1, productos: [{ id: 1 }] };
    obtenerProductosApplicationService.obtenerTodos.mockResolvedValue(data);

    await controller.obtenerTodos(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data });
    expect(next).not.toHaveBeenCalled();
  });

  it('buscar responde 400 si falta query q', async () => {
    const req = { query: {} };
    const res = crearRes();
    const next = jest.fn();

    await controller.buscar(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      codigo: 'PARAMETRO_AUSENTE',
      mensaje: 'Parámetro "q" es requerido'
    });
    expect(obtenerProductosApplicationService.buscar).not.toHaveBeenCalled();
  });

  it('buscar responde 200 cuando q existe', async () => {
    const req = { query: { q: 'teclado' } };
    const res = crearRes();
    const next = jest.fn();
    const data = { cantidad: 1, productos: [{ id: 1, nombre: 'Teclado' }] };
    obtenerProductosApplicationService.buscar.mockResolvedValue(data);

    await controller.buscar(req, res, next);

    expect(obtenerProductosApplicationService.buscar).toHaveBeenCalledWith('teclado');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data });
    expect(next).not.toHaveBeenCalled();
  });

  it('actualizar parsea id y responde 200', async () => {
    const req = {
      params: { id: '11' },
      body: {
        nombre: 'Teclado Pro',
        precio: 20000,
        minStock: 5,
        descripcion: 'desc',
        imagenUrl: 'img',
        idCategoria: 3
      }
    };
    const res = crearRes();
    const next = jest.fn();
    const data = { idProducto: 11, mensaje: 'ok' };
    actualizarProductoApplicationService.ejecutar.mockResolvedValue(data);

    await controller.actualizar(req, res, next);

    expect(actualizarProductoApplicationService.ejecutar).toHaveBeenCalledWith({
      idProducto: 11,
      nombre: 'Teclado Pro',
      precio: 20000,
      minStock: 5,
      descripcion: 'desc',
      imagenUrl: 'img',
      idCategoria: 3
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data });
  });

  it('eliminar parsea id y responde 200', async () => {
    const req = { params: { id: '6' } };
    const res = crearRes();
    const next = jest.fn();
    const data = { idProducto: 6, mensaje: 'eliminado' };
    eliminarProductoApplicationService.ejecutar.mockResolvedValue(data);

    await controller.eliminar(req, res, next);

    expect(eliminarProductoApplicationService.ejecutar).toHaveBeenCalledWith({ idProducto: 6 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data });
  });

  it('propaga errores a next', async () => {
    const req = {};
    const res = crearRes();
    const next = jest.fn();
    const error = new Error('fallo');
    obtenerProductosApplicationService.obtenerTodos.mockRejectedValue(error);

    await controller.obtenerTodos(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});