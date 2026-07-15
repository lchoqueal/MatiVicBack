# MatiVic Store - Backend (Aseguramiento de Calidad y SRE)

Este repositorio contiene el backend del ecosistema **MatiVic** desarrollado bajo patrones DDD (Domain-Driven Design), arquitectura hexagonal y aseguramiento de calidad conforme al estándar **ISO/IEC/IEEE 29119**.

---

## 🛠️ Aseguramiento de Calidad (Capítulo IV)

La suite de pruebas automatizadas está compuesta por pruebas unitarias, de integración y pruebas de aceptación orientadas a BDD.

### 1. Ejecución de Pruebas de la Suite
Para correr todas las pruebas unitarias y de integración de Jest:
```bash
npm run test
```

### 2. Reporte de Cobertura (Coverage)
El proyecto exige y mantiene una cobertura de código superior al **80%** en sentencias y líneas:
```bash
npm run test:cov
```

### 3. Pruebas de Aceptación BDD (Gherkin/Cucumber)
Las pruebas de aceptación utilizan `jest-cucumber` para ejecutar especificaciones paramétricas escritas en Gherkin:
* **Ubicación de especificaciones**: `tests/features/*.feature`
* **Ubicación de definiciones de pasos**: `tests/features/*.steps.test.js`

**Escenarios Implementados:**
* **HU-02: Actualización de inventario en tiempo real**: Valida el descuento y reabastecimiento inmediato de productos ante transacciones de compra/venta.
* **HU-08: Agregar al carrito y pagar en línea**: Emula la interacción con el formulario seguro de la pasarela y la persistencia de boletas en Supabase.

### 4. Pruebas de Mutación (Stryker)
Evaluamos la efectividad y resiliencia de la suite de pruebas unitarias inyectando mutantes lógicos en los archivos de dominio críticos del negocio (`Boleta`, `Producto`, `Stock` y `Precio`).
* **Ejecutar análisis local**:
  ```bash
  npm run test:mutation
  ```
* **Reporte generado**: `reports/mutation/html/index.html` (abrir en navegador).

---

## 📊 Gobernabilidad y Monitoreo SRE (Capítulo VI)

El backend está instrumentado con **OpenTelemetry** y **Prometheus** para monitorear el acuerdo de nivel de servicio (SLA/SLO) y los presupuestos de error operativos:

### 1. Endpoint de Métricas
El backend expone un endpoint nativo para recolección de Prometheus:
* **URL local**: `http://localhost:3000/metrics`

### 2. Indicadores SLI Clave
* **Latencia HTTP** (`http_request_duration_seconds`): Histograma de percentiles P95 para monitorear latencias del carrito (<200ms) e internas (<800ms).
* **Tasa de Errores de Cliente** (`http_requests_total`): Contador de códigos de estado HTTP para alertar fallos no controlados del frontend.
* **Fallas de Stock** (`stock_validation_failures_total`): Contador que registra en tiempo real intentos fallidos de agregar productos sin inventario suficiente.
* **Órdenes Huérfanas** (`orphan_orders_total`): Métrica crítica de consistencia transaccional que rastrea cuando la pasarela aprueba un cobro pero el backend no encuentra la boleta asociada.