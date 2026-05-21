const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

let inventario = {};
let errorCapturado = null;

Given('que en el almacen el producto {string} tiene un stock de {int} unidades', function (codigo, stockInicial) {
    inventario[codigo] = stockInicial;
    errorCapturado = null;
});

When('se procesa una {string} por la cantidad de {int} unidades', function (operacion, cantidad) {
    const codigoProducto = Object.keys(inventario)[0];
    if (operacion === 'venta') inventario[codigoProducto] -= cantidad;
    if (operacion === 'compra') inventario[codigoProducto] += cantidad;
});

When('se intenta procesar una {string} por la cantidad de {int} unidades', function (operacion, cantidad) {
    const codigoProducto = Object.keys(inventario)[0];
    
    try {
        if (operacion === 'venta') {
            if (inventario[codigoProducto] < cantidad) {
                throw new Error("Stock insuficiente");
            }
            inventario[codigoProducto] -= cantidad;
        }
    } catch (error) {
        errorCapturado = error.message;
    }
});

Then('el sistema debe denegar la operacion por {string}', function (mensajeErrorEsperado) {
    assert.strictEqual(
        errorCapturado, 
        mensajeErrorEsperado, 
        `Se esperaba el error "${mensajeErrorEsperado}" pero se obtuvo: "${errorCapturado}"`
    );
});

Then('el stock del producto {string} debe permanecer en {int} unidades', function (codigo, stockEsperado) {
    const stockActual = inventario[codigo];
    assert.strictEqual(
        stockActual, 
        stockEsperado, 
        `El stock cambió erróneamente. Se esperaba ${stockEsperado} pero quedó en ${stockActual}`
    );
});

Then('el stock del producto en el sistema debe cambiar a {int} en tiempo real', function (stockFinalEsperado) {
    const codigoProducto = Object.keys(inventario)[0];
    assert.strictEqual(inventario[codigoProducto], stockFinalEsperado);
});