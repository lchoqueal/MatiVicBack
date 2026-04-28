const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../../domain/entities/Usuario');
const Email = require('../../domain/valueObjects/Email');

/**
 * Application Service: AutenticacionApplicationService
 * Orquesta login y registro de usuarios
 */
class AutenticacionApplicationService {
  constructor(usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  /**
   * Login de administrador
   */
  async loginAdministrador(username, password) {
    // Obtener usuario por nombre
    const usuario = await this.usuarioRepository.obtenerPorNombreUsuario(username);
    
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar contraseña
    const esValida = await bcrypt.compare(password, usuario.contrasena);
    
    if (!esValida) {
      throw new Error('Contraseña incorrecta');
    }

    // Generar JWT
    const token = jwt.sign(
      {
        id: usuario.id_usuario,
        username: usuario.name_user,
        nombre: usuario.nombres
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      token,
      usuario: {
        id: usuario.id_usuario,
        username: usuario.name_user,
        nombre: usuario.nombres,
        apellidos: usuario.apellidos
      }
    };
  }

  /**
   * Registro de administrador
   */
  async registroAdministrador(username, password, nombre, apellidos = '') {
    // Verificar que no exista usuario
    const existente = await this.usuarioRepository.obtenerPorNombreUsuario(username);
    
    if (existente) {
      throw new Error('Usuario ya existe');
    }

    // Hash de contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Crear entidad usuario
    const nuevoUsuario = new Usuario(
      null,
      username,
      new Email(username + '@admin.local'),
      passwordHash,
      nombre,
      apellidos || nombre,
      'activo'
    );

    // Guardar
    await this.usuarioRepository.guardar(nuevoUsuario);

    return {
      mensaje: 'Usuario creado exitosamente',
      usuario: {
        username,
        nombre
      }
    };
  }

  /**
   * Verificar token JWT
   */
  async verificarToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }
}

module.exports = AutenticacionApplicationService;
