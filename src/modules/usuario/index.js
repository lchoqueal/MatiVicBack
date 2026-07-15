const UsuarioRepository = require('./infrastructure/UsuarioRepository');
const EmpleadoRepository = require('./infrastructure/EmpleadoRepository');
const ClienteRepository = require('../cliente/infrastructure/ClienteRepository');
const AutenticacionApplicationService = require('./application/AutenticacionApplicationService');

const autenticacionRoutes = require('./presentation/routes/autenticacionRoutes');

module.exports = (socketIOEmitter) => {
  const usuarioRepository = new UsuarioRepository();
  const empleadoRepository = new EmpleadoRepository();
  const clienteRepository = new ClienteRepository();

  const autenticacionApplicationService = new AutenticacionApplicationService(
    usuarioRepository,
    empleadoRepository,
    clienteRepository
  );

  return autenticacionRoutes(autenticacionApplicationService);
};
