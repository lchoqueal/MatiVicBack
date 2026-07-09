const Cliente = require('../../../../src/modules/cliente/domain/entities/Cliente');

describe('Cliente - validar', () => {
  let cliente;

  beforeEach(() => {
    cliente = new Cliente(
      42,
      'Juan Pérez',
      'juan.perez@example.com',
      'secret123',
      'Pérez',
      '987654321',
      'Av. Siempre Viva 742',
      'activo',
      'contacto@juan.com'
    );
  });

  test('debe validar sin lanzar errores cuando el cliente es correcto', () => {
    expect(() => cliente.validar()).not.toThrow();
  });

  test('debe lanzar error si falta el nombre', () => {
    cliente.nombre = '';
    expect(() => cliente.validar()).toThrow('Nombre requerido');
  });

  test('debe lanzar error si falta el correo de contacto', () => {
    cliente.correo = '   ';
    expect(() => cliente.validar()).toThrow('Correo requerido');
  });
});
