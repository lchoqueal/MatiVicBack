const Carrito = require('../../../../src/modules/carrito/domain/entities/Carrito');
const Precio = require('../../../../src/shared/domain/valueObjects/Precio');

jest.mock('../../../../src/shared/domain/valueObjects/Precio', () => {
  const mockPrecio = jest.fn();
  mockPrecio.mockImplementation((monto) => ({
    monto,
    multiplicar: jest.fn((factor) => mockPrecio(monto * factor))
  }));
  return mockPrecio;
});

describe('Carrito - vaciar', () => {
  let carrito;
  let mockProducto;

  beforeEach(() => {
    mockProducto = {
      id: 1,
      nombre: 'Producto A',
      precio: new Precio(100),
      hayStockPara: jest.fn()
    };
    carrito = new Carrito(1, 'cliente', 123);
  });

  test('debe vaciar el carrito', () => {
    mockProducto.hayStockPara.mockReturnValue(true);
    carrito.agregarItem(mockProducto, 1);

    carrito.vaciar();

    expect(carrito.items).toHaveLength(0);
    expect(carrito.total.monto).toBe(0);
  });
});
