const BoletaRepository = require('./infrastructure/BoletaRepository');
const CrearBoletaApplicationService = require('./application/CrearBoletaApplicationService')

const boletaRoutes = require ('./presentation/routes/boletaRoutes');

module.exports = (socketIOEmitter) =>{
    const boletaRepository = new BoletaRepository()

    const crearBoletaApplicationService = new CrearBoletaApplicationService(boletaRepository);

    return boletaRoutes (
        crearBoletaApplicationService
    );
};

