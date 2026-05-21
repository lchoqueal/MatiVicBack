Feature: Actualización automática del stock disponible

  Scenario: Intento de venta de un producto sin stock suficiente
    Given que en el almacen el producto "PROD-002" tiene un stock de 10 unidades
    When se intenta procesar una "venta" por la cantidad de 15 unidades
    Then el sistema debe denegar la operacion por "Stock insuficiente"
    And el stock del producto "PROD-002" debe permanecer en 10 unidades