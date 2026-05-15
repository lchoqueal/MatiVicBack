const Carrito = require('../../../../src/modules/carrito/domain/entities/Carrito');
const Precio = require('../../../../src/shared/domain/valueObjects/Precio');
const CarritoVacioException = require('../../../../src/modules/carrito/domain/exceptions/CarritoVacioException');

jest.mock('../../../../src/shared/domain/valueObjects/Precio', () => {
  const mockPrecio = jest.fn();
  mockPrecio.mockImplementation((monto) => ({
    monto,
    multiplicar: jest.fn((factor) => mockPrecio(monto * factor))
  }));
  return mockPrecio;
});

describe('Carrito - Constructor', () => {
  let carrito;

  beforeEach(() => {
    carrito = new Carrito(1, 'cliente', 123);
  });

  test('debe crear un carrito con valores iniciales correctos', () => {
    expect(carrito.id).toBe(1);
    expect(carrito.tipoCarrito).toBe('cliente');
    expect(carrito.idCliente).toBe(123);
    expect(carrito.items).toEqual([]);
    expect(carrito.total.monto).toBe(0);
    expect(carrito.estado).toBe('activo');
  });
});
