# ADR 5: Gobernabilidad SRE mediante Prometheus y Grafana Declarativo

## Estado
Aceptado

## Contexto
El monitoreo de MatiVic se basaba únicamente en trazas de Jaeger (OpenTelemetry) para depuración forense en caliente. Sin embargo, no teníamos forma de evaluar el cumplimiento de un Acuerdo de Nivel de Servicio (SLA/SLO), calcular el consumo del presupuesto de error, ni detectar en tiempo real fallos sistémicos masivos como degradaciones de latencia en base de datos o fallos recurrentes de inventario.

## Decisión
Instrumentar el backend e infraestructura de Kubernetes:
1. Instalar `prom-client` en `MatiVicBack` para recopilar métricas nativas del runtime y métricas personalizadas asociadas a los SLOs (latencia HTTP, tasa de errores de cliente, fallas de stock, órdenes huérfanas).
2. Exponer un endpoint estándar `/metrics`.
3. Configurar Prometheus y Grafana de forma puramente declarativa en el repositorio de GitOps (`mi-proyecto-gitops/k8s/monitoring`) para ser aprovisionados automáticamente por Argo CD.

## Consecuencias
* **Positivas**:
  * Visibilidad completa del estado y rendimiento del clúster y la aplicación en tiempo real.
  * Automatización total (GitOps): la infraestructura de monitoreo e instrumentación es declarativa.
* **Negativas**:
  * Incremento en la utilización de CPU y memoria RAM en el clúster local de Kubernetes (Minikube) al tener que ejecutar los recolectores de métricas en segundo plano.
