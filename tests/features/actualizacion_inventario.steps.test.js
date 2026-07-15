const { defineFeature, loadFeature } = require('jest-cucumber');
const path = require('path');
const Producto = require('../../src/modules/producto/domain/entities/Producto');
const Precio = require('../../src/shared/domain/valueObjects/Precio');

// Cargar archivo .feature
const feature = loadFeature(path.join(__dirname, 'actualizacion_inventario.feature'));

defineFeature(feature, test => {
  test('El stock se actualiza inmediatamente tras un movimiento comercial', ({ given, when, then }) => {
    let producto = null;

    given(/^que en el almacen el producto "(.*)" tiene un stock de (\d+) unidades$/, (codigo, stockInicial) => {
      // Instanciar un producto de dominio
      producto = new Producto(
        1,
        'Cargador de prueba',
        new Precio(100),
        parseInt(stockInicial),
        5, // Stock mínimo
        'Descripción',
        'http://imagen.url',
        1 // Categoría
      );
    });

    when(/^se procesa una "(.*)" por la cantidad de (\d+) unidades$/, (operacion, cantidad) => {
      const cantidadNum = parseInt(cantidad);
      if (operacion === 'venta') {
        producto.vender(cantidadNum);
      } else if (operacion === 'compra') {
        producto.reabastecer(cantidadNum);
      }
    });

    then(/^el stock del producto en el sistema debe cambiar a (\d+) en tiempo real$/, (stockFinal) => {
      expect(producto.stock.cantidad).toBe(parseInt(stockFinal));
    });
  });
});
