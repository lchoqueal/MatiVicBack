# IC-11: Mapa de Puertos y Adaptadores - MatiVic Backend

Este documento detalla la segregación de responsabilidades y el acoplamiento cero del dominio frente a factores externos mediante la implementación de Puertos y Adaptadores.

```
       +--------------------------------------------------------+
       |                  CAPA DE INFRAESTRUCTURA               |
       |                                                        |
       |  [Adaptador Primario]                                  |
       |  BoletaController.js / CarritoController.js            |
       |         |                                              |
       |         v                                              |
       |  +--------------------------------------------------+  |
       |  |                 CAPA DE APLICACIÓN               |  |
       |  |                                                  |  |
       |  |  CrearBoletaApplicationService.js                |  |
       |  |        |                                         |  |
       |  |        v                                         |  |
       |  |  +--------------------------------------------+  |  |
       |  |  |               CAPA DE DOMINIO              |  |  |
       |  |  |                                            |  |  |
       |  |  |  [Puerto] ProductoRepository (Interface)   |  |  |
       |  |  |  [Entidades] Boleta, Producto, Stock       |  |  |
       |  |  |                                            |  |  |
       |  |  +--------------------------------------------+  |  |
       |  +--------------------------------------------------+  |
       |         ^                                              |
       |         | (Implementa)                                 |
       |  [Adaptador Secundario]                                |
       |  ProductoRepository.js (Conexión PostgreSQL)           |
       +--------------------------------------------------------+
```

## 1. Puertos (Interfaces del Dominio)
Los puertos se declaran en el dominio y definen las operaciones que requiere el núcleo de negocio, abstrayéndose de la tecnología:
* **`ProductoRepository`**: Define métodos como `obtenerPorId(id)` y `guardar(producto)`.
* **`BoletaRepository`**: Define métodos como `actualizarEstado(id, estado)` y `guardar(boleta)`.

## 2. Adaptadores (Implementaciones de Infraestructura)
Son componentes externos que implementan los puertos o interactúan con la aplicación:
* **Adaptadores Primarios (HTTP/REST)**: Controladores Express (`BoletaController.js`) que reciben peticiones y ejecutan servicios de aplicación.
* **Adaptadores Secundarios (Persistencia)**: Repositorios concretos (`ProductoRepository.js` y `BoletaRepository.js`) que ejecutan consultas SQL nativas contra PostgreSQL/Supabase.
