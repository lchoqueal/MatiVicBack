const express = require('express');
const ClienteRepository = require('./infrastructure/ClienteRepository');

module.exports = (socketIOEmitter) => {
  const clienteRepository = new ClienteRepository();
  const router = express.Router();

  // Actualmente no hay rutas específicas para cliente en presentation/
  // Mantenemos un router vacío para que app.use pueda montarlo sin romper el arranque.
  router.clienteRepository = clienteRepository;

  return router;
};
