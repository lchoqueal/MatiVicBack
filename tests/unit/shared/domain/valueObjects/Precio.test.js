const Precio = require('../../../../../src/shared/domain/valueObjects/Precio');

describe('Precio - Value Object', () => {
  it('debería instanciarse correctamente con montos positivos', () => {
    const precio = new Precio(100.50);
    expect(precio.monto).toBe(100.50);
    expect(precio.toString()).toBe('100.50');
  });

  it('debería lanzar un error si el precio no es proporcionado', () => {
    expect(() => new Precio(null)).toThrow('Precio es requerido');
    expect(() => new Precio(undefined)).toThrow('Precio es requerido');
  });

  it('debería lanzar un error si el precio no es un número', () => {
    expect(() => new Precio('texto')).toThrow('Precio debe ser un número');
  });

  it('debería lanzar un error si el precio es negativo', () => {
    expect(() => new Precio(-10)).toThrow('Precio debe ser mayor o igual a 0');
  });

  it('debería lanzar un error si el precio es demasiado alto', () => {
    expect(() => new Precio(99999999999)).toThrow('Precio demasiado alto');
  });

  it('debería permitir sumar precios', () => {
    const p1 = new Precio(10);
    const p2 = new Precio(20);
    const resultado = p1.sumar(p2);
    expect(resultado.monto).toBe(30);
  });

  it('debería permitir restar precios', () => {
    const p1 = new Precio(50);
    const p2 = new Precio(20);
    const resultado = p1.restar(p2);
    expect(resultado.monto).toBe(30);
  });

  it('debería permitir multiplicar por una cantidad', () => {
    const p1 = new Precio(15.50);
    const resultado = p1.multiplicar(2);
    expect(resultado.monto).toBe(31);
  });

  it('debería verificar igualdad de valores', () => {
    const p1 = new Precio(100);
    const p2 = new Precio(100);
    const p3 = new Precio(200);

    expect(p1.equals(p2)).toBe(true);
    expect(p1.equals(p3)).toBe(false);
  });
});
