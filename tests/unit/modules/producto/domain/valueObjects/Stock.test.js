const Stock = require('../../../../../../src/modules/producto/domain/valueObjects/Stock');

describe('Stock - Value Object', () => {
  it('debería inicializarse correctamente', () => {
    const stock = new Stock(10, 5);
    expect(stock.cantidad).toBe(10);
    expect(stock.minimo).toBe(5);
  });

  it('debería lanzar un error si la cantidad es negativa', () => {
    expect(() => new Stock(-1, 5)).toThrow('Stock no puede ser negativo');
  });

  it('debería lanzar un error si el stock minimo es negativo', () => {
    expect(() => new Stock(10, -5)).toThrow('Stock mínimo no puede ser negativo');
  });

  it('debería decrementar el stock correctamente', () => {
    const stock = new Stock(10, 5);
    const nuevoStock = stock.decrementar(3);
    expect(nuevoStock.cantidad).toBe(7);
  });

  it('debería lanzar error si se decrementa más del stock disponible', () => {
    const stock = new Stock(5, 2);
    expect(() => stock.decrementar(10)).toThrow('Stock insuficiente');
  });

  it('debería incrementar el stock correctamente', () => {
    const stock = new Stock(10, 5);
    const nuevoStock = stock.incrementar(5);
    expect(nuevoStock.cantidad).toBe(15);
  });

  it('debería verificar si está bajo correctamente', () => {
    const stockBajo = new Stock(4, 5);
    expect(stockBajo.estaBajo()).toBe(true);

    const stockNormal = new Stock(10, 5);
    expect(stockNormal.estaBajo()).toBe(false);
  });
});
