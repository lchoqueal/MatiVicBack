const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const inventarioTestingAPI = require('../testing-api/InventarioTestingAPI');

When('se intenta procesar una {string} por la cantidad de {int} unidades', function (operacion, cantidad) {
    inventarioTestingAPI.intentarProcesarVenta(operacion, cantidad);
});

Then('el sistema debe denegar la operacion por {string}', function (mensajeErrorEsperado) {
    assert.strictEqual(
        inventarioTestingAPI.errorCapturado, 
        mensajeErrorEsperado, 
        `Se esperaba el error "${mensajeErrorEsperado}" pero se obtuvo: "${inventarioTestingAPI.errorCapturado}"`
    );
});

Then('el stock del producto {string} debe permanecer en {int} unidades', function (codigo, stockEsperado) {
    const stockActual = inventarioTestingAPI.obtenerStock(codigo);
    assert.strictEqual(
        stockActual, 
        stockEsperado, 
        `El stock cambió erróneamente. Se esperaba ${stockEsperado} pero quedó en ${stockActual}`
    );
});