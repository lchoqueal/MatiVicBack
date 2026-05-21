Feature: Registro de ventas por local

  Como cajero
  quiero registrar ventas por local con detalle de producto y cantidad
  para mantener un control correcto de las transacciones de cada tienda.

  Scenario: Registro exitoso de venta en un local
    Given que un cajero ha iniciado sesión en la caja del "Local Principal"
    When registra la venta de 3 unidades del artículo "PROD-001"
    Then el sistema calcula el costo total y descuenta el stock
    And guarda la transacción vinculada exclusivamente al "Local Principal"

  Scenario: Registro rechazado por stock insuficiente en el local
    Given que un cajero ha iniciado sesión en la caja del "Sucursal Norte"
    When intenta registrar la venta de 100 unidades del artículo "PROD-002"
    Then el sistema no registra la transacción de venta
    And muestra un aviso indicando que la operación no pudo completarse
