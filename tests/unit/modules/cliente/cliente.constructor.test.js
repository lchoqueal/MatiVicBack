const Cliente = require('../../../../src/modules/cliente/domain/entities/Cliente');

describe('Cliente - Constructor', () => {
  test('debe crear un cliente con valores iniciales correctos', () => {
    const cliente = new Cliente(
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

    expect(cliente.id).toBe(42);
    expect(cliente.nombre).toBe('Juan Pérez');
    expect(cliente.email.toString()).toBe('juan.perez@example.com');
    expect(cliente.contrasena).toBe('secret123');
    expect(cliente.apellidos).toBe('Pérez');
    expect(cliente.telefono).toBe('987654321');
    expect(cliente.direccion).toBe('Av. Siempre Viva 742');
    expect(cliente.estado).toBe('activo');
    expect(cliente.correo).toBe('contacto@juan.com');
    expect(cliente.rol).toBe('cliente');
    expect(cliente.createdAt).toBeInstanceOf(Date);
  });
});
