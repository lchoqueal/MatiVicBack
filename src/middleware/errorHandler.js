/**
 * Middleware global de manejo de errores
 * Centra la gestión de excepciones y las convierte a respuestas HTTP
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const codigo = err.codigo || 'ERROR_DESCONOCIDO';
  const mensaje = err.message || 'Error interno del servidor';

  console.error(`[${codigo}] ${mensaje}`, err);

  res.status(statusCode).json({
    success: false,
    codigo,
    mensaje,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
