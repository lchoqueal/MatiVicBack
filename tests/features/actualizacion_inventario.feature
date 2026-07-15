# language: es
Característica: Actualización automática del stock disponible

  Esquema del escenario: El stock se actualiza inmediatamente tras un movimiento comercial
    Dado que en el almacen el producto "<codigo>" tiene un stock de <stock_inicial> unidades
    Cuando se procesa una "<operacion>" por la cantidad de <cantidad> unidades
    Entonces el stock del producto en el sistema debe cambiar a <stock_final> en tiempo real

    Ejemplos:
      | codigo    | stock_inicial | operacion | cantidad | stock_final |
      | PROD-001  | 50            | venta     | 2        | 48          |
      | PROD-001  | 48            | compra    | 10       | 58          |
