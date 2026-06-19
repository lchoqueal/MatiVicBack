const Boleta = require('../../../../../../src/modules/boleta/domain/entities/Boleta');
const TipoVenta = require('../../../../../../src/modules/boleta/domain/valueObjects/TipoVenta');
const Precio = require('../../../../../../src/shared/domain/valueObjects/Precio');
const BoletaInvalidaException = require('../../../../../../src/modules/boleta/domain/exceptions/BoletaInvalidaException');

describe('Boleta', () => {
  test('crea boleta con valores iniciales y tipo de venta online', () => {
    const boleta = new Boleta(1, 'online', 100, 'tarjeta', 1, null, null, 1);

    expect(boleta.id).toBe(1);
    expect(boleta.tipoVenta).toBeInstanceOf(TipoVenta);
    expect(boleta.total).toBeInstanceOf(Precio);
    expect(boleta.total.monto).toBe(100);
    expect(boleta.estado).toBe(Boleta.ESTADOS.PENDIENTE);
    expect(boleta.items).toEqual([]);
    expect(boleta.esOnline()).toBe(true);
    expect(boleta.esFisica()).toBe(false);
  });

  test('valida boleta online con cliente y boleta física con empleado', () => {
    const boletaOnline = new Boleta(1, 'online', 100, 'tarjeta', 1, null, null, 1);
    expect(() => boletaOnline.validar()).not.toThrow();

    const boletaFisica = new Boleta(2, 'fisica', 200, 'efectivo', null, 5, null, 2);
    expect(() => boletaFisica.validar()).not.toThrow();
  });

  test('lanza excepción cuando venta online no tiene cliente', () => {
    const boleta = new Boleta(1, 'online', 100, 'tarjeta', null, null, null, 1);
    expect(() => boleta.validar()).toThrow(BoletaInvalidaException);
  });

  test('lanza excepción cuando venta física no tiene empleado', () => {
    const boleta = new Boleta(1, 'fisica', 100, 'efectivo', null, null, null, 1);
    expect(() => boleta.validar()).toThrow(BoletaInvalidaException);
  });

  test('cambiar estado funciona y rechaza transiciones inválidas', () => {
    const boleta = new Boleta(1, 'online', 100, 'tarjeta', 1, null, null, 1);
    boleta.cambiarEstado(Boleta.ESTADOS.PAGADO);
    expect(boleta.estado).toBe(Boleta.ESTADOS.PAGADO);
    expect(boleta.estaPagada()).toBe(true);

    expect(() => boleta.cambiarEstado('pendiente')).toThrow(BoletaInvalidaException);
  });

  test('marcarPagada y cancelar actualizan el estado correctamente', () => {
    const boleta = new Boleta(1, 'online', 100, 'tarjeta', 1, null, null, 1);
    boleta.marcarPagada();
    expect(boleta.estado).toBe(Boleta.ESTADOS.PAGADO);
    boleta.cancelar();
    expect(boleta.estado).toBe(Boleta.ESTADOS.CANCELADO);
    expect(boleta.estaCancelada()).toBe(true);
  });

  test('agregarItem aumenta la lista de items', () => {
    const boleta = new Boleta(1, 'online', 100, 'tarjeta', 1, null, null, 1);
    boleta.agregarItem(10, 2, 50, 100);
    expect(boleta.items).toHaveLength(1);
    expect(boleta.items[0]).toEqual({ idProducto: 10, cantidad: 2, precio: 50, subtotal: 100 });
  });

  test('lanza excepción para estado inválido', () => {
    const boleta = new Boleta(1, 'online', 100, 'tarjeta', 1, null, null, 1);
    boleta.estado = 'invalid';
    expect(() => boleta.validar()).toThrow('Estado de boleta inválido');
  });
});
