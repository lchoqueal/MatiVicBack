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

describe('Carrito - cambiarCantidadItem', () => {
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

  test('debe cambiar la cantidad de un item', () => {
    mockProducto.hayStockPara.mockReturnValue(true);
    carrito.agregarItem(mockProducto, 1);
    carrito.cambiarCantidadItem(1, 3);

    expect(carrito.items[0].cantidad).toBe(3);
    expect(carrito.total.monto).toBe(300);
  });

  test('debe eliminar el item si nueva cantidad es <= 0', () => {
    mockProducto.hayStockPara.mockReturnValue(true);
    carrito.agregarItem(mockProducto, 1);

    carrito.cambiarCantidadItem(1, 0);

    expect(carrito.items).toHaveLength(0);
  });

  test('debe lanzar error si item no encontrado', () => {
    expect(() => carrito.cambiarCantidadItem(999, 2)).toThrow('Item no encontrado en carrito');
  });
});
