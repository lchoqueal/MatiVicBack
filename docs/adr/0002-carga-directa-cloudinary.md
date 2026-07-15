# ADR 2: Subida Directa de Imágenes a Cloudinary (Unsigned Uploads) desde el Frontend

## Estado
Aceptado

## Contexto
El panel de administración necesita asociar imágenes a los celulares agregados al catálogo. Transferir archivos binarios pesados (imágenes de 3MB-5MB) al backend en formato base64 satura el tráfico HTTP, agota la memoria del servidor Express y sobrecarga la persistencia en la base de datos de producción.

## Decisión
Implementar el flujo de carga descentralizada:
1. El Administrador selecciona el archivo de imagen en el frontend.
2. El frontend realiza una llamada HTTP POST directa al API de Cloudinary usando un **Upload Preset sin firmar (Unsigned)**, sin exponer el `API_SECRET` en el cliente.
3. Cloudinary almacena el binario y devuelve la URL del CDN público.
4. El frontend envía únicamente la URL del string al backend para persistirse en la base de datos Supabase.

## Consecuencias
* **Positivas**:
  * Reducción drástica del consumo de red y CPU en el servidor backend.
  * Persistencia optimizada en base de datos (solo se almacena el string de la URL).
* **Negativas**:
  * Requiere configurar manualmente un Upload Preset en la consola web de Cloudinary.
