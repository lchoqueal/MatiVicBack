# language: es
Característica: Proceso de compra y pago en la tienda virtual

  Esquema del escenario: El cliente liquida su carrito mediante pasarela de pagos
    Dado que el cliente tiene productos agregados en su carrito virtual
    Y se encuentra en el formulario de pasarela de pago seguro
    Cuando introduce los datos de su tarjeta tipo "<tipo_tarjeta>" y confirma la operacion
    Entonces la pasarela procesa el cobro, vacia el carrito y crea la orden en estado "Confirmado"

    Ejemplos:
      | tipo_tarjeta |
      | Visa Debito  |
      | Mastercard   |
