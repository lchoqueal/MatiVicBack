const MetodoPago = require('../../../../../../src/modules/boleta/domain/entities/TipoMetodoPago');
const DomainException = require('../../../../../../src/shared/domain/exceptions/DomainException');

describe('MetodoPago', () => {
  test('acepta métodos válidos y compara correctamente', () => {
    const efectivo = new MetodoPago('efectivo');
    expect(efectivo.toString()).toBe('efectivo');
    expect(efectivo.equals(new MetodoPago('efectivo'))).toBe(true);
    expect(efectivo.equals(new MetodoPago('tarjeta'))).toBe(false);
  });

  test.each([undefined, null, '', 'paypal'])('lanza DomainException para método inválido %p', (valor) => {
    expect(() => new MetodoPago(valor)).toThrow(DomainException);
  });
});
