const DomainException = require('../exceptions/DomainException');

/**
 * Value Object: Email
 * Immutable, validado, comparable por valor
 */
class Email {
  constructor(valor) {
    this.validar(valor);
    this.valor = valor.toLowerCase().trim();
  }

  validar(valor) {
    if (!valor || typeof valor !== 'string') {
      throw new DomainException('Email es requerido y debe ser texto', 400, 'EMAIL_INVALIDO');
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(valor)) {
      throw new DomainException('Formato de email inválido', 400, 'EMAIL_FORMATO_INVALIDO');
    }

    if (valor.length > 255) {
      throw new DomainException('Email muy largo', 400, 'EMAIL_DEMASIADO_LARGO');
    }
  }

  equals(otro) {
    return otro instanceof Email && this.valor === otro.valor;
  }

  toString() {
    return this.valor;
  }
}

module.exports = Email;
