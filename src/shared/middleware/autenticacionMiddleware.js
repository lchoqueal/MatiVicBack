/**
 * Middleware: autenticacionMiddleware
 * Valida JWT en headers
 */
const jwt = require('jsonwebtoken');

const autenticacionMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        codigo: 'TOKEN_AUSENTE',
        mensaje: 'Token no proporcionado en Authorization header'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      codigo: 'TOKEN_INVALIDO',
      mensaje: 'Token inválido o expirado'
    });
  }
};

module.exports = autenticacionMiddleware;
