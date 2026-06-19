const AlertasController = require('../../../../../src/modules/producto/presentation/controllers/AlertasController');

const crearRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('AlertasController', () => {
  it('obtenerProductosStockBajo responde 200 con data', async () => {
    const obtenerAlertasApplicationService = {
      obtenerProductosStockBajo: jest.fn().mockResolvedValue({ cantidad: 1, alertas: [] })
    };
    const controller = new AlertasController(obtenerAlertasApplicationService);
    const req = {};
    const res = crearRes();
    const next = jest.fn();

    await controller.obtenerProductosStockBajo(req, res, next);

    expect(obtenerAlertasApplicationService.obtenerProductosStockBajo).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: { cantidad: 1, alertas: [] }
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('emitirAlertaStockBajo parsea idProducto y responde 200', async () => {
    const obtenerAlertasApplicationService = {
      emitirAlertaStockBajo: jest.fn().mockResolvedValue({ mensaje: 'ok' })
    };
    const controller = new AlertasController(obtenerAlertasApplicationService);
    const req = { params: { idProducto: '33' } };
    const res = crearRes();
    const next = jest.fn();

    await controller.emitirAlertaStockBajo(req, res, next);

    expect(obtenerAlertasApplicationService.emitirAlertaStockBajo).toHaveBeenCalledWith(33);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: { mensaje: 'ok' } });
  });

  it('propaga errores a next', async () => {
    const error = new Error('fallo alerta');
    const obtenerAlertasApplicationService = {
      obtenerProductosStockBajo: jest.fn().mockRejectedValue(error)
    };
    const controller = new AlertasController(obtenerAlertasApplicationService);
    const req = {};
    const res = crearRes();
    const next = jest.fn();

    await controller.obtenerProductosStockBajo(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});