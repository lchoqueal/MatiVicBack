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

describe('Carrito - estado y conteo', () => {
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

  test('debe retornar true si carrito está vacío', () => {
    expect(carrito.estaVacio()).toBe(true);
  });

  test('debe retornar false si tiene items', () => {
    mockProducto.hayStockPara.mockReturnValue(true);
    carrito.agregarItem(mockProducto, 1);
    expect(carrito.estaVacio()).toBe(false);
  });

  test('debe retornar la cantidad de items diferentes', () => {
    mockProducto.hayStockPara.mockReturnValue(true);
    carrito.agregarItem(mockProducto, 1);
    expect(carrito.cantidadItems()).toBe(1);
  });

  test('debe retornar la cantidad total de unidades', () => {
    mockProducto.hayStockPara.mockReturnValue(true);
    carrito.agregarItem(mockProducto, 2);
    expect(carrito.cantidadUnidades()).toBe(2);
  });
});
