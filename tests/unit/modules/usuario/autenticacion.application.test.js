jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  genSalt: jest.fn(),
  hash: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn()
}));

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AutenticacionApplicationService = require('../../../../src/modules/usuario/application/AutenticacionApplicationService');
const Usuario = require('../../../../src/modules/usuario/domain/entities/Usuario');
const Email = require('../../../../src/modules/usuario/domain/valueObjects/Email');
const { crearUsuarioRepositoryMock } = require('./mocks/UsuarioRepositoryMock');

describe('AutenticacionApplicationService - unit', () => {
  let usuarioRepository;
  let service;

  beforeEach(() => {
    process.env.JWT_SECRET = 'secret-test';
    usuarioRepository = crearUsuarioRepositoryMock();
    service = new AutenticacionApplicationService(usuarioRepository);
    jest.clearAllMocks();
  });

  test('loginAdministrador debe retornar token y usuario', async () => {
    usuarioRepository.obtenerPorNombreUsuario.mockResolvedValue({
      id_usuario: 1,
      user_name: 'admin',
      nombres: 'Admin',
      apellidos: 'User',
      rol: 'administrador',
      estado: 'activo',
      contrasena: 'hash'
    });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('token-jwt');

    const resultado = await service.loginAdministrador('admin', 'secreto');

    expect(resultado.token).toBe('token-jwt');
    expect(resultado.usuario.rol).toBe('administrador');
    expect(jwt.sign).toHaveBeenCalled();
  });

  test('loginAdministrador debe fallar si usuario no existe', async () => {
    usuarioRepository.obtenerPorNombreUsuario.mockResolvedValue(null);

    await expect(service.loginAdministrador('admin', 'secreto')).rejects.toThrow('Usuario no encontrado');
  });

  test('loginAdministrador debe fallar si rol no es administrador', async () => {
    usuarioRepository.obtenerPorNombreUsuario.mockResolvedValue({
      rol: 'cliente',
      estado: 'activo'
    });

    await expect(service.loginAdministrador('admin', 'secreto')).rejects.toThrow('Acceso denegado');
  });

  test('loginAdministrador debe fallar si usuario inactivo', async () => {
    usuarioRepository.obtenerPorNombreUsuario.mockResolvedValue({
      rol: 'administrador',
      estado: 'inactivo'
    });

    await expect(service.loginAdministrador('admin', 'secreto')).rejects.toThrow('Usuario inactivo');
  });

  test('loginAdministrador debe fallar si contrasena incorrecta', async () => {
    usuarioRepository.obtenerPorNombreUsuario.mockResolvedValue({
      rol: 'administrador',
      estado: 'activo',
      contrasena: 'hash'
    });
    bcrypt.compare.mockResolvedValue(false);

    await expect(service.loginAdministrador('admin', 'secreto')).rejects.toThrow('Contraseña incorrecta');
  });

  test('registroAdministrador debe guardar usuario', async () => {
    usuarioRepository.obtenerPorNombreUsuario.mockResolvedValue(null);
    usuarioRepository.guardar.mockResolvedValue({ id_usuario: 1 });
    bcrypt.genSalt.mockResolvedValue('salt');
    bcrypt.hash.mockResolvedValue('hash');

    const resultado = await service.registroAdministrador('admin', 'secreto', 'admin', 'User');

    expect(resultado.mensaje).toBe('Administrador creado exitosamente');
    expect(usuarioRepository.guardar).toHaveBeenCalledWith(expect.any(Usuario));
  });

  test('registroAdministrador debe fallar si usuario existe', async () => {
    usuarioRepository.obtenerPorNombreUsuario.mockResolvedValue({ id_usuario: 2 });

    await expect(service.registroAdministrador('admin', 'secreto', 'admin', 'User')).rejects.toThrow('Usuario ya existe');
  });

  test('verificarToken debe retornar payload', async () => {
    jwt.verify.mockReturnValue({ id: 1, username: 'admin' });

    const resultado = await service.verificarToken('token-jwt');

    expect(resultado.username).toBe('admin');
  });

  test('verificarToken debe fallar si token invalido', async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error('Token inválido o expirado');
    });

    await expect(service.verificarToken('token-jwt')).rejects.toThrow('Token inválido o expirado');
  });
});
