const ClienteRepository = require('./infrastructure/ClienteRepository');

module.exports = (socketIOEmitter) => {
  const clienteRepository = new ClienteRepository();

  // Actualmente no hay rutas específicas para cliente en presentation/
  // Exportamos el repository para que otros módulos puedan consumirlo si es necesario.
  return {
    clienteRepository
  };
};
