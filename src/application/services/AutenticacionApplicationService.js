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

    // Validar que sea administrador
    if (usuario.rol !== 'administrador') {
      throw new Error('Acceso denegado. Solo administradores pueden ingresar en este momento');
    }

    // Validar que esté activo
    if (usuario.estado !== 'activo') {
      throw new Error('Usuario inactivo');
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
        username: usuario.user_name,
        nombre: usuario.nombres,
        rol: usuario.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      token,
      usuario: {
        id: usuario.id_usuario,
        username: usuario.user_name,
        nombre: usuario.nombres,
        apellidos: usuario.apellidos,
        rol: usuario.rol
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

    // Crear entidad usuario con rol ADMINISTRADOR
    const nuevoUsuario = new Usuario(
      null,
      nombre,
      new Email(username + '@admin.local'),
      passwordHash,
      apellidos || nombre,
      'administrador',  // ← ROL ADMINISTRADOR
      'activo'
    );

    // Guardar
    await this.usuarioRepository.guardar(nuevoUsuario);

    return {
      mensaje: 'Administrador creado exitosamente',
      usuario: {
        username,
        nombre,
        rol: 'administrador'
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
