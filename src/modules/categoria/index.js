const CategoriaRepository = require('./infrastructure/CategoriaRepository');
const ObtenerCategoriasApplicationService = require('./application/ObtenerCategoriasApplicationService');
const CrearCategoriaApplicationService = require('./application/CrearCategoriaApplicationService');

const categoriaRoutes = require('./presentation/routes/categoriaRoutes');

module.exports = () => {
    const categoriaRepository = new CategoriaRepository();

    const obtenerCategoriasApplicationService = new ObtenerCategoriasApplicationService(categoriaRepository);
    const crearCategoriaApplicationService = new CrearCategoriaApplicationService(categoriaRepository);

    return categoriaRoutes(
        obtenerCategoriasApplicationService,
        crearCategoriaApplicationService
    );
};
