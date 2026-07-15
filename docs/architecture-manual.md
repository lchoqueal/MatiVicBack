# IC-12: Manual de Arquitectura de Software - MatiVic

Este manual establece los lineamientos arquitectónicos y de codificación táctica seguidos por el equipo de desarrollo de MatiVic.

## 1. Patrón Arquitectónico: Arquitectura Hexagonal
Para asegurar la mantenibilidad y evolución del e-commerce a largo plazo, el sistema adopta una **Arquitectura Hexagonal (Puertos y Adaptadores)**.

### Reglas de Dependencia
1. Las dependencias fluyen estrictamente desde el exterior hacia el centro.
2. La capa de **Dominio** es el núcleo central y no puede importar componentes de **Aplicación** o **Infraestructura** (cero importaciones de Express, pg-pool o variables de red).
3. La capa de **Aplicación** solo puede importar entidades del Dominio y puertos (interfaces).
4. La capa de **Infraestructura** conoce y utiliza las capas de Aplicación y Dominio para resolver puertos y peticiones.

## 2. Estructura de Capas en Código
```
src/
├── index.js (Punto de entrada de Express)
├── modules/ (Módulos independientes del sistema)
│   ├── producto/
│   │   ├── domain/ (Entidades, Value Objects e interfaces de Repositorios)
│   │   ├── application/ (Casos de uso: Actualizar, Eliminar)
│   │   └── infrastructure/ (Repositorios PostgreSQL y Controladores Express)
│   └── boleta/
│       ├── domain/
│       ├── application/
│       └── infrastructure/
└── shared/ (Configuraciones de base de datos y middlewares comunes)
```
