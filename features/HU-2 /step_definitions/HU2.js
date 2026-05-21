const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const inventarioTestingAPI = require('../testing-api/InventarioTestingAPI');

Given('que en el almacen el producto {string} tiene un stock de {int} unidades', function (codigo, stockInicial) {
    inventarioTestingAPI.establecerStock(codigo, stockInicial);
});

When('se procesa una {string} por la cantidad de {int} unidades', function (operacion, cantidad) {
    inventarioTestingAPI.procesarMovimiento(operacion, cantidad);
});

Then('el stock del producto en el sistema debe cambiar a {int} en tiempo real', function (stockFinalEsperado) {
    const stockActual = inventarioTestingAPI.obtenerStockActual();

    assert.strictEqual(
        stockActual, 
        stockFinalEsperado, 
        `Error: Se esperaba un stock de ${stockFinalEsperado} pero se obtuvo ${stockActual}`
    );
});