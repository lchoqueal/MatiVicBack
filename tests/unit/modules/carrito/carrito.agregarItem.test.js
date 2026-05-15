const Carrito = require('../../../src/modules/carrito/domain/entities/Carrito');
const Precio = require('../../../src/shared/domain/valueObjects/Precio');

jest.mock('../../../src/shared/domain/valueObjects/Precio', () => {
  const mockPrecio = jest.fn();
  mockPrecio.mockImplementation((monto) => ({
    monto,
    multiplicar: jest.fn((factor) => mockPrecio(monto * factor))
  }));
  return mockPrecio;
});

describe('Carrito - agregarItem', () => {
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

  test('debe agregar un nuevo item al carrito', () => {
    mockProducto.hayStockPara.mockReturnValue(true);
    carrito.agregarItem(mockProducto, 2);

    expect(carrito.items).toHaveLength(1);
    expect(carrito.items[0].idProducto).toBe(1);
    expect(carrito.items[0].cantidad).toBe(2);
    expect(carrito.total.monto).toBe(200);
  });

  test('debe incrementar cantidad si el producto ya existe', () => {
    mockProducto.hayStockPara.mockReturnValue(true);
    carrito.agregarItem(mockProducto, 1);
    carrito.agregarItem(mockProducto, 3);

    expect(carrito.items).toHaveLength(1);
    expect(carrito.items[0].cantidad).toBe(4);
    expect(carrito.total.monto).toBe(400);
  });

  test('debe lanzar error si cantidad es <= 0', () => {
    expect(() => carrito.agregarItem(mockProducto, 0)).toThrow('Cantidad debe ser mayor a 0');
  });

  test('debe lanzar error si no hay stock suficiente', () => {
    mockProducto.hayStockPara.mockReturnValue(false);
    expect(() => carrito.agregarItem(mockProducto, 5)).toThrow('Stock insuficiente de Producto A');
  });
});
