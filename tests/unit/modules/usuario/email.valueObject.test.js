const Email = require('../../../../src/modules/usuario/domain/valueObjects/Email');
const DomainException = require('../../../../src/shared/domain/exceptions/DomainException');

describe('Email - value object', () => {
  test('debe normalizar a minusculas', () => {
    const email = new Email('ADMIN@LOCAL.COM');

    expect(email.toString()).toBe('admin@local.com');
  });

  test('debe lanzar error si falta email', () => {
    expect(() => new Email('')).toThrow(DomainException);
  });

  test('debe lanzar error si formato es invalido', () => {
    expect(() => new Email('admin-local.com')).toThrow('Formato de email inválido');
  });

  test('debe lanzar error si email es demasiado largo', () => {
    const muyLargo = `${'a'.repeat(250)}@a.com`;

    expect(() => new Email(muyLargo)).toThrow('Email muy largo');
  });
});
