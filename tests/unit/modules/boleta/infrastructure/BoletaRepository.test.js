jest.mock('../../../../../src/shared/config/db', () => ({
  query: jest.fn()
}));

const db = require('../../../../../src/shared/config/db');
const BoletaRepository = require('../../../../../src/modules/boleta/infrastructure/BoletaRepository');
const Boleta = require('../../../../../src/modules/boleta/domain/entities/Boleta');

describe('BoletaRepository', () => {
  let repository;

  beforeEach(() => {
    repository = new BoletaRepository();
    db.query.mockReset();
  });

  test('obtenerPorId devuelve una boleta cuando existe', async () => {
    db.query.mockResolvedValueOnce({ rows: [{
      id_boleta: 10,
      tipo_venta: 'online',
      metodo_pago: 'tarjeta',
      total: 150,
      estado_boleta: 'pagado',
      id_cliente_boleta: 5,
      id_empleado_boleta: null,
      id_locale: 1,
      id_carrito: 20,
      fecha_emision: new Date()
    }] });

    const boleta = await repository.obtenerPorId(10);

    expect(boleta).toBeInstanceOf(Boleta);
    expect(boleta.id).toBe(10);
    expect(boleta.estado).toBe('pagado');
    expect(boleta.total.monto).toBe(150);
  });

  test('obtenerPorId devuelve null cuando no encuentra la boleta', async () => {
    db.query.mockResolvedValueOnce({ rows: [] });
    const boleta = await repository.obtenerPorId(999);
    expect(boleta).toBeNull();
  });

  test('guardar persiste y devuelve la boleta creada', async () => {
    db.query.mockResolvedValueOnce({ rows: [{
      id_boleta: 11,
      tipo_venta: 'fisica',
      metodo_pago: 'efectivo',
      total: 200,
      estado_boleta: 'pendiente',
      id_cliente_boleta: null,
      id_empleado_boleta: 3,
      id_locale: 2,
      id_carrito: 7,
      fecha_emision: new Date()
    }] });

    const boleta = new Boleta(11, 'fisica', 200, 'efectivo', null, 3, 2, 7);
    const resultado = await repository.guardar(boleta);

    expect(resultado).toBeInstanceOf(Boleta);
    expect(resultado.id).toBe(11);
    expect(db.query).toHaveBeenCalled();
  });

  test('obtenerTotalVentas devuelve 0 cuando no hay filas', async () => {
    db.query.mockResolvedValueOnce({ rows: [{ total_ventas: null }] });
    const total = await repository.obtenerTotalVentas();
    expect(total).toBe(0);
  });

  test('actualizarEstado devuelve la fila actualizada', async () => {
    db.query.mockResolvedValueOnce({ rows: [{ id_boleta: 12, estado_boleta: 'cancelado' }] });
    const resultado = await repository.actualizarEstado(12, 'cancelado');
    expect(resultado).toEqual({ id_boleta: 12, estado_boleta: 'cancelado' });
  });
});
