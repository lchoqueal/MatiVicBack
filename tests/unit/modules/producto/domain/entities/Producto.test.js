const Producto = require('../../../../../../src/modules/producto/domain/entities/Producto');
const Precio = require('../../../../../../src/shared/domain/valueObjects/Precio');
const Stock = require('../../../../../../src/modules/producto/domain/valueObjects/Stock');

describe('Producto - Entidad de Dominio', () => {
  it('debería instanciar un producto correctamente', () => {
    const producto = new Producto(
      1,
      'Celular de prueba',
      150000,
      15,
      5,
      'Descripción del celular',
      'http://imagen.url',
      1
    );

    expect(producto.id).toBe(1);
    expect(producto.nombre).toBe('Celular de prueba');
    expect(producto.precio.monto).toBe(150000);
    expect(producto.stock.cantidad).toBe(15);
    expect(producto.minStock).toBe(5);
    expect(producto.estado).toBe('activo');
  });

  it('debería lanzar error si el nombre está vacío', () => {
    expect(() => {
      new Producto(1, '', 100, 10, 5).validar();
    }).toThrow('Nombre de producto requerido');
  });

  it('debería lanzar error si el stock es negativo', () => {
    expect(() => {
      const prod = new Producto(1, 'Prueba', 100, -1, 5);
      prod.validar();
    }).toThrow('Stock no puede ser negativo');
  });

  it('debería reabastecer stock correctamente', () => {
    const producto = new Producto(1, 'Prueba', 100, 10, 5);
    producto.reabastecer(5);
    expect(producto.stock.cantidad).toBe(15);
  });

  it('debería validar si hay stock disponible para una cantidad', () => {
    const producto = new Producto(1, 'Prueba', 100, 10, 5);
    expect(producto.hayStockPara(5)).toBe(true);
    expect(producto.hayStockPara(15)).toBe(false);
  });

  it('debería detectar si el stock está bajo', () => {
    const producto = new Producto(1, 'Prueba', 100, 4, 5);
    expect(producto.tieneStockBajo()).toBe(true);
  });

  it('debería permitir cambiar el precio', () => {
    const producto = new Producto(1, 'Prueba', 100, 10, 5);
    producto.cambiarPrecio(150);
    expect(producto.precio.monto).toBe(150);
  });

  it('debería permitir activar y desactivar el producto', () => {
    const producto = new Producto(1, 'Prueba', 100, 10, 5);
    producto.desactivar();
    expect(producto.estado).toBe('inactivo');
    producto.activar();
    expect(producto.estado).toBe('activo');
  });
});
