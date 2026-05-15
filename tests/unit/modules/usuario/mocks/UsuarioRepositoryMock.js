const crearUsuarioRepositoryMock = () => ({
  guardar: jest.fn(),
  obtenerPorNombreUsuario: jest.fn(),
  obtenerPorId: jest.fn(),
  obtenerTodos: jest.fn(),
  actualizar: jest.fn(),
  eliminar: jest.fn()
});

module.exports = {
  crearUsuarioRepositoryMock
};
