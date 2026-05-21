Feature: Registro de productos en inventario

  Como responsable de inventario
  quiero registrar productos nuevos con sus datos principales
  para mantener actualizado el control del inventario.

  Scenario: Registro exitoso de un producto nuevo
    Given que el responsable de inventario tiene un producto listo para registrar
    When registra un producto con nombre, descripción, código, categoría, precio y stock válidos
    Then el sistema incorpora el producto al inventario
    And confirma que el producto quedó disponible para su gestión

  Scenario: Registro rechazado por datos inválidos del producto
    Given que el responsable de inventario prepara un producto nuevo
    When intenta registrarlo con datos obligatorios incompletos o inválidos
    Then el sistema no registra el producto
    And muestra un aviso indicando que los datos deben revisarse