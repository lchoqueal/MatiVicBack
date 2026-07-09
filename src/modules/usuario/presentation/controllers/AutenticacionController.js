/**
 * Controller: AutenticacionController
 * Maneja login y registro
 */
class AutenticacionController {
  constructor(autenticacionApplicationService) {
    this.autenticacionApplicationService = autenticacionApplicationService;
  }

  /**
   * POST /auth/login
   */
  async login(req, res, next) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          codigo: 'CREDENCIALES_INCOMPLETAS',
          mensaje: 'Username y password son requeridos'
        });
      }

      const resultado = await this.autenticacionApplicationService.loginAdministrador(username, password);

      return res.status(200).json({
        success: true,
        data: resultado
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/registro
   */
  async registro(req, res, next) {
    try {
      const { username, password, nombre, apellidos } = req.body;

      if (!username || !password || !nombre) {
        return res.status(400).json({
          success: false,
          codigo: 'DATOS_INCOMPLETOS',
          mensaje: 'Username, password y nombre son requeridos'
        });
      }

      const resultado = await this.autenticacionApplicationService.registroAdministrador(
        username,
        password,
        nombre,
        apellidos
      );

      return res.status(201).json({
        success: true,
        data: resultado
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/verificar-token
   */
  async verificarToken(req, res, next) {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          codigo: 'TOKEN_AUSENTE',
          mensaje: 'Token no proporcionado'
        });
      }

      const decoded = await this.autenticacionApplicationService.verificarToken(token);

      return res.status(200).json({
        success: true,
        data: decoded
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AutenticacionController;
