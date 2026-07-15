const client = require('prom-client');

// Crear un registro personalizado
const register = new client.Registry();

// Habilitar la recolección de métricas por defecto de Node.js (CPU, memoria, etc.)
client.collectDefaultMetrics({ register });

// 1. Contador de peticiones HTTP totales (para tasa de errores de cliente/servidor)
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de peticiones HTTP procesadas por MatiVicBack',
  labelNames: ['method', 'route', 'status'],
});

// 2. Histograma de latencia HTTP (para percentiles P95 de rendimiento)
const httpRequestDurationSeconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Latencia de las peticiones HTTP en segundos',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.05, 0.1, 0.2, 0.5, 0.8, 1, 2, 5] // Buckets alineados a los SLOs de latencia (<200ms, <500ms, <800ms)
});

// 3. Contador de fallas de stock en tiempo real
const stockValidationFailuresTotal = new client.Counter({
  name: 'stock_validation_failures_total',
  help: 'Fallas registradas al validar stock disponible de productos',
  labelNames: ['product_id', 'nombre_producto']
});

// 4. Contador de órdenes huérfanas críticas (webhook recibido pero sin boleta local)
const orphanOrdersTotal = new client.Counter({
  name: 'orphan_orders_total',
  help: 'Fallas criticas de consistencia donde la pasarela confirma cobro pero no existe boleta',
  labelNames: ['order_id', 'status_pago']
});

// Registrar las métricas personalizadas
register.registerMetric(httpRequestsTotal);
register.registerMetric(httpRequestDurationSeconds);
register.registerMetric(stockValidationFailuresTotal);
register.registerMetric(orphanOrdersTotal);

module.exports = {
  register,
  httpRequestsTotal,
  httpRequestDurationSeconds,
  stockValidationFailuresTotal,
  orphanOrdersTotal
};
