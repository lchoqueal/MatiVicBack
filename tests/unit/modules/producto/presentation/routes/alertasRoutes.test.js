/**
 * Tests: alertasRoutes
 * 
 * Fase 2: Blindaje - Pruebas Unitarias del Dominio
 * - Validar que las rutas mapeen correctamente a los controllers
 * - Validar los middlewares (autenticación, autorización)
 * - Validar reglas de negocio del dominio
 * 
 * Fase 3: Simulacro - Aislamiento mediante Arquitectura Hexagonal
 * - Usar mocks para aislar Application Services
 * - Testear solo el comportamiento de las rutas
 * - No depender de bases de datos o servicios externos
 */

const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const alertasRoutes = require('../../../../../../src/modules/producto/presentation/routes/alertasRoutes');

/**
 * Helper para generar tokens JWT para pruebas
 * Fase 3: Aislar la generación de tokens
 */
const generarTokenTest = (rol = 'cliente') => {
  const payload = {
    id: 1,
    email: 'usuario@test.com',
    rol: rol
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

describe('AlertasRoutes', () => {
  let app;
  let obtenerAlertasApplicationService;

  beforeEach(() => {
    /**
     * Fase 3: Crear mock de Application Service
     * El servicio está completamente aislado del resto de la aplicación
     */
    obtenerAlertasApplicationService = {
      obtenerProductosStockBajo: jest.fn(),
      emitirAlertaStockBajo: jest.fn()
    };

    // Crear aplicación Express con las rutas
    app = express();
    app.use(express.json());
    app.use('/alertas', alertasRoutes(obtenerAlertasApplicationService));
  });

  describe('GET /alertas/stock-bajo', () => {
    it('debería retornar 401 si no hay token', async () => {
      /**
       * Fase 3: Validar que middleware de autenticación sea aplicado
       * Esta ruta SIEMPRE requiere autenticación
       */
      const response = await request(app).get('/alertas/stock-bajo');

      expect(response.status).toBe(401);
      expect(response.body.codigo).toBe('TOKEN_AUSENTE');
      expect(
        obtenerAlertasApplicationService.obtenerProductosStockBajo
      ).not.toHaveBeenCalled();
    });

    it('debería retornar 403 si usuario no es administrador', async () => {
      /**
       * Fase 3: Validar que middleware de autorización (rol) sea aplicado
       * Solo administradores pueden ver alertas de stock
       * Regla del dominio: solo administradores ven estado crítico
       */
      const tokenCliente = generarTokenTest('cliente');
      const response = await request(app)
        .get('/alertas/stock-bajo')
        .set('Authorization', `Bearer ${tokenCliente}`);

      expect(response.status).toBe(403);
      expect(response.body.codigo).toBe('ACCESO_DENEGADO');
      expect(
        obtenerAlertasApplicationService.obtenerProductosStockBajo
      ).not.toHaveBeenCalled();
    });

    it('debería retornar 200 con lista de productos con stock bajo', async () => {
      /**
       * Fase 2: Validar comportamiento correcto de la ruta
       * - Usuario autenticado como administrador
       * - Application service retorna lista de alertas
       */
      const alertasMock = {
        cantidad: 2,
        alertas: [
          {
            idProducto: 1,
            nombre: 'Monitor',
            stock: 2,
            minStock: 10,
            alerta: 'Stock crítico'
          },
          {
            idProducto: 3,
            nombre: 'Webcam',
            stock: 1,
            minStock: 5,
            alerta: 'Stock crítico'
          }
        ]
      };

      obtenerAlertasApplicationService.obtenerProductosStockBajo.mockResolvedValue(
        alertasMock
      );

      const tokenAdmin = generarTokenTest('administrador');
      const response = await request(app)
        .get('/alertas/stock-bajo')
        .set('Authorization', `Bearer ${tokenAdmin}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: alertasMock
      });
      expect(
        obtenerAlertasApplicationService.obtenerProductosStockBajo
      ).toHaveBeenCalled();
    });

    it('debería retornar 200 incluso si no hay alertas', async () => {
      /**
       * Fase 2: Caso edge - sin alertas
       */
      const alertasMock = {
        cantidad: 0,
        alertas: []
      };

      obtenerAlertasApplicationService.obtenerProductosStockBajo.mockResolvedValue(
        alertasMock
      );

      const tokenAdmin = generarTokenTest('administrador');
      const response = await request(app)
        .get('/alertas/stock-bajo')
        .set('Authorization', `Bearer ${tokenAdmin}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: alertasMock
      });
    });
  });

  describe('POST /alertas/emitir-stock-bajo/:idProducto', () => {
    it('debería retornar 401 si no hay token', async () => {
      /**
       * Fase 3: Validar que middleware de autenticación sea aplicado
       */
      const response = await request(app).post('/alertas/emitir-stock-bajo/1');

      expect(response.status).toBe(401);
      expect(response.body.codigo).toBe('TOKEN_AUSENTE');
      expect(
        obtenerAlertasApplicationService.emitirAlertaStockBajo
      ).not.toHaveBeenCalled();
    });

    it('debería retornar 403 si usuario no es administrador', async () => {
      /**
       * Fase 3: Validar que middleware de autorización (rol) sea aplicado
       * Solo administradores pueden emitir alertas de stock
       */
      const tokenCliente = generarTokenTest('cliente');
      const response = await request(app)
        .post('/alertas/emitir-stock-bajo/1')
        .set('Authorization', `Bearer ${tokenCliente}`);

      expect(response.status).toBe(403);
      expect(response.body.codigo).toBe('ACCESO_DENEGADO');
      expect(
        obtenerAlertasApplicationService.emitirAlertaStockBajo
      ).not.toHaveBeenCalled();
    });

    it('debería retornar 200 cuando alerta es emitida exitosamente', async () => {
      /**
       * Fase 2: Validar comportamiento correcto de la ruta
       * - Usuario autenticado como administrador
       * - idProducto es parseado como entero
       * - Application service procesa la emisión de alerta
       */
      const resultadoAlertaMock = {
        idProducto: 5,
        nombre: 'Teclado',
        stock: 3,
        minStock: 10,
        mensaje: 'Alerta de stock bajo emitida'
      };

      obtenerAlertasApplicationService.emitirAlertaStockBajo.mockResolvedValue(
        resultadoAlertaMock
      );

      const tokenAdmin = generarTokenTest('administrador');
      const response = await request(app)
        .post('/alertas/emitir-stock-bajo/5')
        .set('Authorization', `Bearer ${tokenAdmin}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: resultadoAlertaMock
      });
      expect(
        obtenerAlertasApplicationService.emitirAlertaStockBajo
      ).toHaveBeenCalledWith(5);
    });

    it('debería parsear correctamente el idProducto como entero', async () => {
      /**
       * Fase 2: Validar que parámetro de ruta sea parseado correctamente
       */
      const resultadoAlertaMock = { idProducto: 123, mensaje: 'ok' };
      obtenerAlertasApplicationService.emitirAlertaStockBajo.mockResolvedValue(
        resultadoAlertaMock
      );

      const tokenAdmin = generarTokenTest('administrador');
      await request(app)
        .post('/alertas/emitir-stock-bajo/123')
        .set('Authorization', `Bearer ${tokenAdmin}`);

      expect(
        obtenerAlertasApplicationService.emitirAlertaStockBajo
      ).toHaveBeenCalledWith(123);
    });

    it('debería soportar múltiples llamadas con diferentes idProductos', async () => {
      /**
       * Fase 3: Validar aislamiento - independencia de llamadas
       */
      const alerta1 = { idProducto: 1, mensaje: 'Alerta 1' };
      const alerta2 = { idProducto: 2, mensaje: 'Alerta 2' };

      obtenerAlertasApplicationService.emitirAlertaStockBajo
        .mockResolvedValueOnce(alerta1)
        .mockResolvedValueOnce(alerta2);

      const tokenAdmin = generarTokenTest('administrador');

      const response1 = await request(app)
        .post('/alertas/emitir-stock-bajo/1')
        .set('Authorization', `Bearer ${tokenAdmin}`);

      const response2 = await request(app)
        .post('/alertas/emitir-stock-bajo/2')
        .set('Authorization', `Bearer ${tokenAdmin}`);

      expect(response1.body.data).toEqual(alerta1);
      expect(response2.body.data).toEqual(alerta2);
      expect(
        obtenerAlertasApplicationService.emitirAlertaStockBajo
      ).toHaveBeenCalledTimes(2);
    });
  });
});
