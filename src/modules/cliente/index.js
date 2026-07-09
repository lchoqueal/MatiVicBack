const express = require('express');
const ClienteRepository = require('./infrastructure/ClienteRepository');

module.exports = (socketIOEmitter) => {
  const clienteRepository = new ClienteRepository();
  const router = express.Router();

  // No hay rutas de cliente todavía, pero Express necesita un router válido.
  return express.Router();
};
