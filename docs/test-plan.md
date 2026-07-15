# IC-32: Plan de Pruebas Integrales de Software - MatiVic

Este documento describe el plan formal de pruebas para el aseguramiento de calidad del backend de la aplicación MatiVic, alineado al estándar **ISO/IEC/IEEE 29119**.

## 1. Niveles de Pruebas Planificados
1. **Pruebas Unitarias**: Verificación individual de las reglas matemáticas de los Value Objects (`Precio`, `Stock`) y comportamiento lógico de las entidades de dominio sin dependencias externas.
2. **Pruebas de Integración**: Pruebas de integración de rutas de API (`autenticacion.routes.integracion.test.js`) levantando servidores simulados en memoria.
3. **Pruebas de Aceptación (BDD)**: Validación de criterios de aceptación de negocio utilizando especificaciones Gherkin ejecutables en lenguaje natural (`actualizacion_inventario.feature`).

## 2. Objetivos de Cobertura y Métricas
* **Umbral mínimo de Cobertura de Líneas**: `80.00%`.
* **Umbral mínimo de Cobertura de Funciones**: `80.00%`.
* **Herramienta de Ejecución**: Jest.
* **Herramienta de Mutación**: Stryker Mutator (para evaluar la robustez y supervivencia de los mutantes).
