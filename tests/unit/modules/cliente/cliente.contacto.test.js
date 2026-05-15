const Cliente = require('../../../../src/modules/cliente/domain/entities/Cliente');

describe('Cliente - contacto y teléfono', () => {
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

  test('debe actualizar teléfono y dirección correctamente', () => {
    const resultado = cliente.actualizarContacto('912345678', 'Calle Falsa 123');

    expect(resultado).toBe(cliente);
    expect(cliente.telefono).toBe('912345678');
    expect(cliente.direccion).toBe('Calle Falsa 123');
  });

  test('debe validar teléfonos válidos', () => {
    expect(cliente.esTelefonoValido('987654321')).toBe(true);
    expect(cliente.esTelefonoValido('+51 987 654 321')).toBe(true);
    expect(cliente.esTelefonoValido('987-654-321')).toBe(true);
  });

  test('debe invalidar teléfonos inválidos', () => {
    expect(cliente.esTelefonoValido('1234')).toBe(false);
    expect(cliente.esTelefonoValido('telefono123')).toBe(false);
    expect(cliente.esTelefonoValido('')).toBe(false);
  });
});
