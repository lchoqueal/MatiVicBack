# Tabla de Vinculación Arquitectónica

Documento técnico del MVP que relaciona las historias de usuario con sus especificaciones ejecutables y sus adaptadores de prueba bajo una arquitectura hexagonal.

## Matriz de correspondencia

| Historia de usuario | Archivo `.feature` | `Step Definitions` | `TestingAPI` | Capa / componente principal |
|---|---|---|---|---|
| HU-01: Registro de productos | `features/HU-1/hu-01-registro-productos.feature` | `features/HU-1/step_definitions/hu-01-registro-productos.steps.js` | `features/HU-1/testing-api/ProductoTestingAPI.js` | `src/modules/producto/application/ActualizarProductoApplicationService.js` y dominio de producto |
| HU-02: Actualización de inventario en tiempo real | `features/HU-2/HU2.feature` y `features/HU-2/HU2_exception.feature` | `features/HU-2/step_definitions/HU2.js` y `features/HU-2/step_definitions/HU2_Exeception.js` | `features/HU-2/testing-api/InventarioTestingAPI.js` | Dominio de producto y reglas de stock |
| HU-05: Registro de ventas por local | `features/HU-5/hu-05-registro-ventas-por-local.feature` | `features/HU-5/step_definitions/hu-05-registro-ventas-por-local.steps.js` | `features/HU-5/testing-api/VentaPorLocalTestingAPI.js` | `src/modules/carrito`, `src/modules/boleta` y flujo de ventas |

## Criterio arquitectónico

| Elemento | Función |
|---|---|
| `.feature` | Describe el comportamiento observable del negocio en lenguaje Gherkin. |
| `Step Definitions` | Traducen cada paso a llamadas del arnés de prueba. |
| `TestingAPI` | Actúa como adaptador de pruebas y llama directamente al caso de uso o a la lógica del dominio. |
| Dominio / Caso de uso | Ejecuta las reglas de negocio sin depender de UI, HTTP ni base de datos en memoria. |

## Alcance validado

- HU-01 cubre el alta de productos.
- HU-02 cubre actualización de stock y manejo de excepción por stock insuficiente.
- HU-05 cubre el registro de ventas por local.

## Verificación

La suite BDD se ejecuta con `npx cucumber-js` y valida escenarios sin acoplamiento a la interfaz gráfica.