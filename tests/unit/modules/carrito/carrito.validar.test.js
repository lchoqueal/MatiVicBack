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

describe('Carrito - validar', () => {
  let carrito;

  beforeEach(() => {
    carrito = new Carrito(1, 'cliente', 123);
  });

  test('debe lanzar CarritoVacioException si carrito está vacío', () => {
    expect(() => carrito.validar()).toThrow(CarritoVacioException);
  });

  test('debe lanzar error si total es <= 0', () => {
    carrito.items = [{ idProducto: 1, subtotal: new Precio(0) }];
    carrito.total = new Precio(0);

    expect(() => carrito.validar()).toThrow('Total debe ser mayor a 0');
  });
});
