# ADR 1: Adopción de Diseño Guiado por el Dominio (DDD) y Arquitectura Hexagonal

## Estado
Aceptado

## Contexto
El backend original de MatiVic crecía de forma monolítica con alto acoplamiento entre la lógica de negocio y la base de datos Supabase/PostgreSQL. Cualquier cambio en el motor de persistencia requería modificar directamente los controladores Express.

## Decisión
Dividir el backend utilizando patrones de Diseño Guiado por el Dominio (DDD) y la Arquitectura Hexagonal (Puertos y Adaptadores):
* **Capa de Dominio**: Contiene las entidades puras de negocio (`Boleta`, `Producto`, `Stock`, `Precio`) libres de frameworks. Protegen las invariantes del negocio.
* **Capa de Aplicación**: Orquesta los casos de uso (`CrearBoletaApplicationService`, `ActualizarProductoApplicationService`).
* **Capa de Infraestructura**: Adaptadores para PostgreSQL (`ProductoRepository`, `BoletaRepository`) y controladores web.

## Consecuencias
* **Positivas**:
  * Alta testabilidad (facilidad de implementar el 80% de cobertura y Cucumber).
  * Lógica de negocio protegida e independiente del motor de base de datos.
* **Negativas**:
  * Mayor cantidad de archivos y carpetas, aumentando la curva de aprendizaje inicial.
