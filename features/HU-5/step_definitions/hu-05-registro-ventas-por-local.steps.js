const { Before, Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const VentaPorLocalTestingAPI = require('../testing-api/VentaPorLocalTestingAPI');

Before(function () {
  this.ventaTestingAPI = new VentaPorLocalTestingAPI();
  this.resultado = null;
  this.localSesion = null;
  this.codigoProducto = null;
  this.cantidadVenta = null;
});

Given('que un cajero ha iniciado sesión en la caja del {string}', function (localOrigen) {
  this.localSesion = localOrigen;
  this.ventaTestingAPI.iniciarSesionCaja(localOrigen);
});

When('registra la venta de {int} unidades del artículo {string}', function (cantidad, codigo) {
  this.cantidadVenta = cantidad;
  this.codigoProducto = codigo;
  this.resultado = this.ventaTestingAPI.registrarVenta(codigo, cantidad);
});

Then('el sistema calcula el costo total y descuenta el stock', function () {
  assert.strictEqual(this.resultado.exito, true);

  const precioUnitario = this.ventaTestingAPI.productos[this.codigoProducto].precioUnitario;
  const totalEsperado = Number((precioUnitario * this.cantidadVenta).toFixed(2));

  assert.strictEqual(this.resultado.transaccion.total, totalEsperado);
  assert.strictEqual(this.resultado.stockRestante >= 0, true);
});

Then('guarda la transacción vinculada exclusivamente al {string}', function (localOrigen) {
  const transaccion = this.ventaTestingAPI.obtenerUltimaTransaccion();

  assert.ok(transaccion);
  assert.strictEqual(transaccion.localOrigen, localOrigen);
});

When('intenta registrar la venta de {int} unidades del artículo {string}', function (cantidad, codigo) {
  this.resultado = this.ventaTestingAPI.intentarRegistrarVenta(codigo, cantidad);
});

Then('el sistema no registra la transacción de venta', function () {
  assert.strictEqual(this.resultado.exito, false);
  assert.strictEqual(this.resultado.transaccion, null);
  assert.strictEqual(this.ventaTestingAPI.transacciones.length, 0);
});

Then('muestra un aviso indicando que la operación no pudo completarse', function () {
  assert.ok(this.resultado.error);
  assert.match(this.resultado.error, /Stock insuficiente|Cantidad inválida|Producto no encontrado|No existe una sesión/);
});
