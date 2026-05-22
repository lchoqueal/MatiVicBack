/**
 * Middleware: validacionMiddleware
 * Valida datos en request body
 */

/**
 * Validar que campos requeridos existan y no estén vacíos
 */
const validarCamposRequeridos = (campos) => {
  return (req, res, next) => {
    const faltantes = campos.filter(campo => !req.body[campo] || req.body[campo].toString().trim() === '');
    
    if (faltantes.length > 0) {
      return res.status(400).json({
        success: false,
        codigo: 'VALIDACION_ERROR',
        mensaje: `Campos requeridos: ${faltantes.join(', ')}`
      });
    }

    next();
  };
};

/**
 * Validar que campo sea número entero
 */
const validarEntero = (campo) => {
  return (req, res, next) => {
    const valor = req.params[campo] || req.body[campo];
    
    if (valor && isNaN(parseInt(valor))) {
      return res.status(400).json({
        success: false,
        codigo: 'VALIDACION_ERROR',
        mensaje: `${campo} debe ser un número`
      });
    }

    next();
  };
};

/**
 * Validar que campo sea número positivo
 */
const validarPositivo = (campo) => {
  return (req, res, next) => {
    const valor = req.body[campo];
    
    if (valor && (isNaN(valor) || valor <= 0)) {
      return res.status(400).json({
        success: false,
        codigo: 'VALIDACION_ERROR',
        mensaje: `${campo} debe ser un número positivo`
      });
    }

    next();
  };
};

module.exports = {
  validarCamposRequeridos,
  validarEntero,
  validarPositivo
};
