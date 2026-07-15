# ADR 4: Integración de la Pasarela de Pagos Mediante Pestaña Independiente y Webhooks

## Estado
Aceptado

## Contexto
El flujo original de cobros requería redireccionar el navegador de la tienda virtual hacia la pasarela bancaria. Esto destruía el estado SPA (Single Page Application) de la aplicación de React y, si el usuario experimentaba pérdidas de conexión durante la redirección de regreso, el backend de la tienda nunca se enteraba de si el pago fue aprobado, dejando pedidos pagados sin registrar.

## Decisión
Rediseñar el flujo de checkout:
1. El cliente confirma la orden y el frontend abre la pasarela de pagos en una **nueva pestaña** (`_blank`) mediante `window.open`.
2. El usuario procesa su pago en la pasarela segura. Al finalizar, la pasarela dispara de forma asíncrona un **Webhook HTTP POST** directo a `MatiVicBack` (`/boleta/webhook-pago`) para reportar el resultado transaccional directamente al servidor de la tienda.
3. El cliente es devuelto a una página final en la pestaña secundaria, mientras que la pestaña principal de la tienda conserva el login del usuario intacto.

## Consecuencias
* **Positivas**:
  * Consistencia transaccional garantizada: la confirmación del pago no depende de la conectividad o acciones del navegador del cliente (se procesa de servidor a servidor vía Webhook).
  * Mejor flujo de navegación (UX).
* **Negativas**:
  * Algunos bloqueadores de pop-ups en navegadores estrictos pueden intentar interceptar el `window.open` si no se dispara a partir de una interacción directa del usuario.
