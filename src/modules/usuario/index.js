const UsuarioRepository = require('./infrastructure/UsuarioRepository');
const EmpleadoRepository = require('./infrastructure/EmpleadoRepository');
const AutenticacionApplicationService = require('./application/AutenticacionApplicationService');

const autenticacionRoutes = require('./presentation/routes/autenticacionRoutes');

module.exports = (socketIOEmitter) => {
  const usuarioRepository = new UsuarioRepository();
  const empleadoRepository = new EmpleadoRepository();

  const autenticacionApplicationService = new AutenticacionApplicationService(
    usuarioRepository,
    empleadoRepository
  );

  return autenticacionRoutes(autenticacionApplicationService);
};
