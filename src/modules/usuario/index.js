const UsuarioRepository = require('./infrastructure/UsuarioRepository');
const AutenticacionApplicationService = require('./application/AutenticacionApplicationService');

const autenticacionRoutes = require('./presentation/routes/autenticacionRoutes');

module.exports = (socketIOEmitter) => {
  const usuarioRepository = new UsuarioRepository();

  const autenticacionApplicationService = new AutenticacionApplicationService(
    usuarioRepository
  );

  return autenticacionRoutes(autenticacionApplicationService);
};
