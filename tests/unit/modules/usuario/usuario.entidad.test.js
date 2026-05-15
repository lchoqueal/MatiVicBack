const Usuario = require('../../../../src/modules/usuario/domain/entities/Usuario');
const Email = require('../../../../src/modules/usuario/domain/valueObjects/Email');

describe('Usuario - entidad', () => {
  test('debe validar nombre requerido', () => {
    const usuario = new Usuario(1, '', new Email('admin@local.com'), 'secreto', '', 'cliente', 'activo');

    expect(() => usuario.validar()).toThrow('Nombre requerido');
  });

  test('debe validar rol permitido', () => {
    const usuario = new Usuario(1, 'Juan', new Email('juan@local.com'), 'secreto', '', 'gerente', 'activo');

    expect(() => usuario.validar()).toThrow('Rol inválido');
  });

  test('debe activar y desactivar usuario', () => {
    const usuario = new Usuario(1, 'Maria', new Email('maria@local.com'), 'secreto', '', 'cliente', 'activo');

    usuario.desactivar();
    expect(usuario.estaActivo()).toBe(false);

    usuario.activar();
    expect(usuario.estaActivo()).toBe(true);
  });

  test('debe identificar roles', () => {
    const admin = new Usuario(1, 'Admin', new Email('admin@local.com'), 'secreto', '', 'administrador', 'activo');
    const empleado = new Usuario(2, 'Empleado', new Email('empleado@local.com'), 'secreto', '', 'empleado', 'activo');
    const cliente = new Usuario(3, 'Cliente', new Email('cliente@local.com'), 'secreto', '', 'cliente', 'activo');

    expect(admin.esAdministrador()).toBe(true);
    expect(empleado.esEmpleado()).toBe(true);
    expect(cliente.esCliente()).toBe(true);
  });
});
