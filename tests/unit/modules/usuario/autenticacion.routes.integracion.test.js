const express = require('express');
const request = require('supertest');
const AutenticacionApplicationService = require('../../../../src/modules/usuario/application/AutenticacionApplicationService');
const autenticacionRoutes = require('../../../../src/modules/usuario/presentation/routes/autenticacionRoutes');
const RepositorioUsuarioEnMemoria = require('./mocks/RepositorioUsuarioEnMemoria');

describe('Autenticacion - integracion', () => {
  let app;
  let repo;

  beforeEach(() => {
    process.env.JWT_SECRET = 'secret-test';
    app = express();
    app.use(express.json());

    repo = new RepositorioUsuarioEnMemoria();
    const service = new AutenticacionApplicationService(repo);

    app.use('/auth', autenticacionRoutes(service));
    app.use((err, req, res, next) => {
      res.status(500).json({
        success: false,
        mensaje: err.message
      });
    });
  });

  test('debe registrar y loguear administrador', async () => {
    const registro = await request(app)
      .post('/auth/registro')
      .send({
        username: 'admin',
        password: 'secreto',
        nombre: 'admin',
        apellidos: 'User'
      });

    expect(registro.status).toBe(201);
    expect(registro.body.success).toBe(true);

    const login = await request(app)
      .post('/auth/login')
      .send({
        username: 'admin',
        password: 'secreto'
      });

    expect(login.status).toBe(200);
    expect(login.body.success).toBe(true);
    expect(login.body.data.token).toBeDefined();
  });

  test('debe verificar token', async () => {
    const registro = await request(app)
      .post('/auth/registro')
      .send({
        username: 'admin',
        password: 'secreto',
        nombre: 'admin',
        apellidos: 'User'
      });

    expect(registro.status).toBe(201);

    const login = await request(app)
      .post('/auth/login')
      .send({
        username: 'admin',
        password: 'secreto'
      });

    const token = login.body.data.token;

    const verificacion = await request(app)
      .post('/auth/verificar-token')
      .set('Authorization', `Bearer ${token}`);

    expect(verificacion.status).toBe(200);
    expect(verificacion.body.success).toBe(true);
    expect(verificacion.body.data.username).toBe('admin');
  });
});
