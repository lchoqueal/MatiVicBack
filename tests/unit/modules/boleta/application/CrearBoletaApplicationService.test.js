jest.mock('../../../../../src/shared/config/db', () => ({
  connect: jest.fn()
}));

const db = require('../../../../../src/shared/config/db');
const CrearBoletaApplicationService = require('../../../../../src/modules/boleta/application/CrearBoletaApplicationService');

describe('CrearBoletaApplicationService', () => {
  let client;
  let service;
  let productoRepository;
  let socketIOEmitter;

  beforeEach(() => {
    client = { query: jest.fn(), release: jest.fn() };
    db.connect.mockResolvedValue(client);
    productoRepository = { obtenerPorId: jest.fn() };
    socketIOEmitter = {
      emitirBoletaCreada: jest.fn(),
      emitirStockActualizado: jest.fn()
    };
    service = new CrearBoletaApplicationService(null, null, productoRepository, socketIOEmitter);
  });

  test('crea boleta y emite eventos cuando el carrito es válido', async () => {
    client.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ rows: [{ id_carrito: 1 }] })
      .mockResolvedValueOnce({ rows: [{ id_producto: 10, cantidad: 2, precio_unit: 50 }] })
      .mockResolvedValueOnce({ rows: [{ id_producto: 10, stock: 5 }] })
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ rows: [{ id_boleta: 100, tipo_venta: 'online', metodo_pago: 'tarjeta', total: 100, estado_boleta: 'pagado', id_cliente_boleta: 1, id_empleado_boleta: null, id_locale: 2, id_carrito: 1 }] })
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({});

    productoRepository.obtenerPorId.mockResolvedValue({ id_producto: 10, stock: 3 });

    const resultado = await service.ejecutar({
      idCarrito: 1,
      tipoVenta: 'online',
      metodoPago: 'tarjeta',
      idCliente: 1,
      idEmpleado: null,
      idLocal: 2
    });

    expect(client.query).toHaveBeenCalledWith('BEGIN');
    expect(client.query).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM carrito WHERE id_carrito = $1'), [1]);
    expect(client.query).toHaveBeenCalledWith(expect.stringContaining('UPDATE producto'), [2, 10]);
    expect(client.query).toHaveBeenCalledWith(expect.stringContaining('COMMIT'));
    expect(socketIOEmitter.emitirBoletaCreada).toHaveBeenCalled();
    expect(socketIOEmitter.emitirStockActualizado).toHaveBeenCalledWith({ id_producto: 10, stock: 3 });
    expect(resultado).toEqual({ idBoleta: 100, total: 100, estado: 'pagado', mensaje: 'Boleta creada exitosamente' });
    expect(client.release).toHaveBeenCalled();
  });

  test('hace rollback cuando el carrito no existe', async () => {
    client.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ rows: [] });

    await expect(service.ejecutar({
      idCarrito: 1,
      tipoVenta: 'online',
      metodoPago: 'tarjeta',
      idCliente: 1,
      idEmpleado: null,
      idLocal: 2
    })).rejects.toThrow('Carrito no encontrado');

    expect(client.query).toHaveBeenCalledWith('ROLLBACK');
    expect(client.release).toHaveBeenCalled();
  });
});
