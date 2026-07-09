const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../domain/entities/Usuario');
const Email = require('../domain/valueObjects/Email');

/**
 * Application Service: AutenticacionApplicationService
 * Orquesta login y registro de usuarios
 */
class AutenticacionApplicationService {
  constructor(usuarioRepository, empleadoRepository = null) {
    this.usuarioRepository = usuarioRepository;
    this.empleadoRepository = empleadoRepository;
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
   * Registro de cliente (público)
   */
  async registroCliente(username, password, nombre, apellidos = '', dni = null) {
    // Verificar que no exista usuario
    const existente = await this.usuarioRepository.obtenerPorNombreUsuario(username);
    
    if (existente) {
      throw new Error('Usuario ya existe');
    }

    // Hash de contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Crear entidad usuario con rol CLIENTE
    const nuevoUsuario = new Usuario(
      null,
      nombre,
      new Email(username + '@cliente.local'),
      passwordHash,
      apellidos || nombre,
      'cliente',
      'activo'
    );
    nuevoUsuario.dni = dni;

    // Guardar
    const usuarioGuardado = await this.usuarioRepository.guardar(nuevoUsuario);

    return {
      mensaje: 'Cliente registrado exitosamente',
      usuario: {
        id: usuarioGuardado.id_usuario,
        username,
        nombre,
        rol: 'cliente'
      }
    };
  }

  /**
   * Crear empleado (protegido - solo admin)
   */
  async crearEmpleado(username, password, nombre, apellidos = '', dni = null, fechaIngreso, horario, rol = 'empleado') {
    if (!this.empleadoRepository) {
      throw new Error('EmpleadoRepository no esta inyectado');
    }

    // Validar rol
    if (!['empleado', 'administrador'].includes(rol)) {
      throw new Error('Rol invalido. Debe ser empleado o administrador');
    }

    // Verificar que no exista usuario
    const existente = await this.usuarioRepository.obtenerPorNombreUsuario(username);
    
    if (existente) {
      throw new Error('Usuario ya existe');
    }

    // Validar fecha ingreso
    if (!fechaIngreso) {
      throw new Error('Fecha de ingreso es requerida');
    }

    if (!horario) {
      throw new Error('Horario es requerido');
    }

    // Hash de contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Crear entidad usuario con rol según parámetro
    const nuevoUsuario = new Usuario(
      null,
      nombre,
      new Email(username + '@empleado.local'),
      passwordHash,
      apellidos || nombre,
      rol,
      'activo'
    );
    nuevoUsuario.dni = dni;

    // Guardar usuario
    const usuarioGuardado = await this.usuarioRepository.guardar(nuevoUsuario);

    // Crear registro en tabla empleado
    const empleadoGuardado = await this.empleadoRepository.crear(
      usuarioGuardado.id_usuario,
      fechaIngreso,
      horario
    );

    return {
      mensaje: `${rol.charAt(0).toUpperCase() + rol.slice(1)} creado exitosamente`,
      usuario: {
        id: usuarioGuardado.id_usuario,
        username,
        nombre,
        rol: rol
      },
      empleado: {
        fechaIngreso: empleadoGuardado.fecha_ingreso,
        horario: empleadoGuardado.horario,
        estado: empleadoGuardado.estado_empleado
      }
    };
  }

  /**
   * Login generico (cualquier rol)
   * Este método reemplaza loginAdministrador para permitir login a cualquier usuario activo
   */
  async login(username, password) {
    // Obtener usuario por nombre
    const usuario = await this.usuarioRepository.obtenerPorNombreUsuario(username);
    
    if (!usuario) {
      throw new Error('Usuario no encontrado');
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
