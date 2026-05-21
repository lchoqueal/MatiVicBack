const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

let inventario = {};

Given('que en el almacen el producto {string} tiene un stock de {int} unidades', function (codigo, stockInicial) {
    inventario[codigo] = stockInicial;
});

When('se procesa una {string} por la cantidad de {int} unidades', function (operacion, cantidad) {
    const codigoProducto = Object.keys(inventario)[0]; 
    
    if (operacion === 'venta') {
        inventario[codigoProducto] -= cantidad;
    } else if (operacion === 'compra') {
        inventario[codigoProducto] += cantidad;
    } else {
        throw new Error(`Operación no reconocida: ${operacion}`);
    }
});

Then('el stock del producto en el sistema debe cambiar a {int} en tiempo real', function (stockFinalEsperado) {
    const codigoProducto = Object.keys(inventario)[0];
    const stockActual = inventario[codigoProducto];

    assert.strictEqual(
        stockActual, 
        stockFinalEsperado, 
        `Error: Se esperaba un stock de ${stockFinalEsperado} pero se obtuvo ${stockActual}`
    );
});