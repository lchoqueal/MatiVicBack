/**
 * Middleware: rolMiddleware
 * Valida que el usuario tenga el rol requerido
 */

const esAdministrador = (req, res, next) => {
  if (req.usuario?.rol !== 'administrador') {
    return res.status(403).json({
      success: false,
      codigo: 'ACCESO_DENEGADO',
      mensaje: 'Solo administradores pueden acceder a este recurso'
    });
  }
  next();
};

const esEmpleado = (req, res, next) => {
  if (req.usuario?.rol !== 'empleado') {
    return res.status(403).json({
      success: false,
      codigo: 'ACCESO_DENEGADO',
      mensaje: 'Solo empleados pueden acceder a este recurso'
    });
  }
  next();
};

const esCliente = (req, res, next) => {
  if (req.usuario?.rol !== 'cliente') {
    return res.status(403).json({
      success: false,
      codigo: 'ACCESO_DENEGADO',
      mensaje: 'Solo clientes pueden acceder a este recurso'
    });
  }
  next();
};

const esAdministradorOEmpleado = (req, res, next) => {
  if (req.usuario?.rol !== 'administrador' && req.usuario?.rol !== 'empleado') {
    return res.status(403).json({
      success: false,
      codigo: 'ACCESO_DENEGADO',
      mensaje: 'Solo administradores y empleados pueden acceder a este recurso'
    });
  }
  next();
};

module.exports = {
  esAdministrador,
  esEmpleado,
  esCliente,
  esAdministradorOEmpleado
};
