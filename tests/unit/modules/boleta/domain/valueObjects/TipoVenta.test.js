const TipoVenta = require('../../../../../../src/modules/boleta/domain/valueObjects/TipoVenta');
const DomainException = require('../../../../../../src/shared/domain/exceptions/DomainException');

describe('TipoVenta', () => {
  test('acepta valores válidos y detecta el tipo de venta', () => {
    const online = new TipoVenta('online');
    expect(online.esOnline()).toBe(true);
    expect(online.esFisica()).toBe(false);
    expect(online.toString()).toBe('online');

    const fisica = new TipoVenta('fisica');
    expect(fisica.esOnline()).toBe(false);
    expect(fisica.esFisica()).toBe(true);
    expect(fisica.equals(new TipoVenta('fisica'))).toBe(true);
    expect(fisica.equals(online)).toBe(false);
  });

  test.each([undefined, null, '', 'invalid'])('lanza DomainException para valor inválido %p', (valor) => {
    expect(() => new TipoVenta(valor)).toThrow(DomainException);
  });
});
