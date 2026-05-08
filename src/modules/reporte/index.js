const BoletaRepository = require('../boleta/infrastructure/BoletaRepository');
const ProductoRepository = require('../producto/infrastructure/ProductoRepository');
const ObtenerReportesApplicationService = require('./application/ObtenerReportesApplicationService');

const reportesRoutes = require('./presentation/routes/reportesRoutes');

module.exports = (socketIOEmitter) => {
  const boletaRepository = new BoletaRepository();
  const productoRepository = new ProductoRepository();

  const obtenerReportesApplicationService = new ObtenerReportesApplicationService(
    boletaRepository,
    productoRepository
  );

  return reportesRoutes(obtenerReportesApplicationService);
};
