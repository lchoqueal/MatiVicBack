# ADR 3: Persistencia del Carrito de Compras en LocalStorage

## Estado
Aceptado

## Contexto
El carrito de compras de MatiVic es administrado en memoria mediante React Context en el cliente. Al recargar la página (F5) o navegar entre rutas, el estado del carrito se perdía por completo, obligando al usuario a buscar y añadir los productos nuevamente.

## Decisión
Implementar un sistema de persistencia del estado en el cliente utilizando la API del navegador `localStorage` vinculada directamente a los hooks de React en `CartContext.tsx`. 
La base de datos remota de Supabase únicamente se impacta al hacer clic en "Confirmar Pago" para registrar de forma unificada el carrito y la boleta, evitando peticiones redundantes e innecesarias en cada acción de "Agregar al carrito".

## Consecuencias
* **Positivas**:
  * Experiencia de usuario (UX) mejorada: el carrito retiene los datos indefinidamente en la pestaña.
  * Disminución del volumen de peticiones concurrentes de escritura en base de datos.
* **Negativas**:
  * Si el cliente ingresa desde otro dispositivo diferente, su carrito local no se sincronizará automáticamente (se acepta esto como comportamiento esperado de un e-commerce ágil).
