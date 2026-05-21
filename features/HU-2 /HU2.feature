Feature: Actualización automática del stock disponible

  Scenario Outline: El stock se actualiza inmediatamente tras un movimiento comercial
    Given que en el almacen el producto "<codigo>" tiene un stock de <stock_inicial> unidades
    When se procesa una "<operacion>" por la cantidad de <cantidad> unidades
    Then el stock del producto en el sistema debe cambiar a <stock_final> en tiempo real

    Examples:
      | codigo   | stock_inicial | operacion | cantidad | stock_final |
      | PROD-001 | 50            | venta     | 2        | 48          |
      | PROD-001 | 48            | compra    | 10       | 58          |