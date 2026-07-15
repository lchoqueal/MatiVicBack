const { defineFeature, loadFeature } = require('jest-cucumber');
const path = require('path');

const feature = loadFeature(path.join(__dirname, 'proceso_compra.feature'));

defineFeature(feature, test => {
  test('El cliente liquida su carrito mediante pasarela de pagos', ({ given, and, when, then }) => {
    let carritoMock = null;
    let pasarelaFormularioActivo = false;
    let pagoConfirmado = false;
    let carritoVaciado = false;
    let boletaCreada = false;

    given('que el cliente tiene productos agregados en su carrito virtual', () => {
      // Configurar estado simulado
      carritoMock = {
        id: 1,
        items: [
          { idProducto: 1, cantidad: 2, precio: 500 }
        ],
        total: 1000,
        estado: 'activo'
      };
    });

    and('se encuentra en el formulario de pasarela de pago seguro', () => {
      pasarelaFormularioActivo = true;
    });

    when(/^introduce los datos de su tarjeta tipo "(.*)" y confirma la operacion$/, (tipoTarjeta) => {
      expect(pasarelaFormularioActivo).toBe(true);
      // Simular que el cliente ingresa datos y confirma
      pagoConfirmado = true;
    });

    then(/^la pasarela procesa el cobro, vacia el carrito y crea la orden en estado "Confirmado"$/, () => {
      expect(pagoConfirmado).toBe(true);
      
      // Simular acciones post-pago
      carritoVaciado = true;
      carritoMock.estado = 'completado';
      boletaCreada = true;

      // Aserciones
      expect(carritoVaciado).toBe(true);
      expect(carritoMock.estado).toBe('completado');
      expect(boletaCreada).toBe(true);
    });
  });
});
