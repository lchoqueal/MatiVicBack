const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const productoRoutes = require('../../../../../../src/modules/producto/presentation/routes/productoRoutes');

/**
 * Helper para generar tokens JWT para pruebas
 * Fase 3: Aislar la generación de tokens para no depender de servicios reales
 */
const generarTokenTest = (rol = 'cliente') => {
  const payload = {
    id: 1,
    email: 'usuario@test.com',
    rol: rol
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

describe('ProductoRoutes', () => {
  let app;
  let obtenerProductosApplicationService;
  let actualizarProductoApplicationService;
  let eliminarProductoApplicationService;

  beforeEach(() => {
    /**
     * Fase 3: Crear mocks de Application Services
     * Estos servicios están aislados del resto de la aplicación
     */
    obtenerProductosApplicationService = {
      obtenerTodos: jest.fn(),
      buscar: jest.fn(),
      obtenerStockBajo: jest.fn(),
      obtenerMasVendidos: jest.fn()
    };

    actualizarProductoApplicationService = {
      ejecutar: jest.fn()
    };

    eliminarProductoApplicationService = {
      ejecutar: jest.fn()
    };

    // Crear aplicación Express con las rutas
    app = express();
    app.use(express.json());
    app.use(
      '/productos',
      productoRoutes(
        obtenerProductosApplicationService,
        actualizarProductoApplicationService,
        eliminarProductoApplicationService
      )
    );
  });

  describe('GET /productos', () => {
    it('debería retornar 200 con lista de productos', async () => {
      /**
       * Fase 2: Validar comportamiento de la ruta
       * - La ruta no requiere autenticación
       * - Debe llamar al application service
       * - Debe retornar status 200 y success true
       */
      const productosMock = {
        cantidad: 2,
        productos: [
          { id: 1, nombre: 'Teclado', precio: 10000 },
          { id: 2, nombre: 'Mouse', precio: 5000 }
        ]
      };

      obtenerProductosApplicationService.obtenerTodos.mockResolvedValue(
        productosMock
      );

      const response = await request(app).get('/productos');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: productosMock
      });
      expect(obtenerProductosApplicationService.obtenerTodos).toHaveBeenCalled();
    });
  });

  describe('GET /productos/buscar', () => {
    it('debería retornar 200 cuando parámetro q existe', async () => {
      /**
       * Fase 2: Validar que query string sea obligatorio
       * - Parámetro "q" es requerido para la búsqueda
       */
      const resultadoMock = {
        cantidad: 1,
        productos: [{ id: 1, nombre: 'Teclado Mecánico' }]
      };

      obtenerProductosApplicationService.buscar.mockResolvedValue(
        resultadoMock
      );

      const response = await request(app).get('/productos/buscar?q=teclado');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: resultadoMock
      });
      expect(obtenerProductosApplicationService.buscar).toHaveBeenCalledWith(
        'teclado'
      );
    });

    it('debería retornar 400 cuando falta parámetro q', async () => {
      /**
       * Fase 2: Validación - parámetro ausente
       * El controller valida que "q" sea proporcionado
       */
      const response = await request(app).get('/productos/buscar');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        codigo: 'PARAMETRO_AUSENTE',
        mensaje: 'Parámetro "q" es requerido'
      });
      expect(obtenerProductosApplicationService.buscar).not.toHaveBeenCalled();
    });
  });

  describe('GET /productos/stock-bajo', () => {
    it('debería retornar 200 con productos con stock bajo', async () => {
      /**
       * Fase 2: Validar que la ruta mapee correctamente al service
       * - No requiere autenticación
       */
      const productosMock = {
        cantidad: 1,
        productos: [{ id: 3, nombre: 'Monitor', stock: 2 }]
      };

      obtenerProductosApplicationService.obtenerStockBajo.mockResolvedValue(
        productosMock
      );

      const response = await request(app).get('/productos/stock-bajo');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: productosMock
      });
    });
  });

  describe('GET /productos/mas-vendidos', () => {
    it('debería retornar 200 con límite por defecto 10', async () => {
      /**
       * Fase 2: Validar comportamiento por defecto
       */
      const productosMock = { cantidad: 3, productos: [] };

      obtenerProductosApplicationService.obtenerMasVendidos.mockResolvedValue(
        productosMock
      );

      const response = await request(app).get('/productos/mas-vendidos');

      expect(response.status).toBe(200);
      expect(
        obtenerProductosApplicationService.obtenerMasVendidos
      ).toHaveBeenCalledWith(10);
    });

    it('debería usar límite especificado en query string', async () => {
      /**
       * Fase 2: Validar que parámetro opcional sea procesado
       */
      const productosMock = { cantidad: 2, productos: [] };

      obtenerProductosApplicationService.obtenerMasVendidos.mockResolvedValue(
        productosMock
      );

      await request(app).get('/productos/mas-vendidos?limite=5');

      expect(
        obtenerProductosApplicationService.obtenerMasVendidos
      ).toHaveBeenCalledWith(5);
    });
  });

  describe('PUT /productos/:id', () => {
    it('debería retornar 401 si no hay token', async () => {
      /**
       * Fase 3: Validar que middleware de autenticación sea aplicado
       */
      const response = await request(app)
        .put('/productos/1')
        .send({ nombre: 'Nuevo', precio: 15000 });

      expect(response.status).toBe(401);
      expect(response.body.codigo).toBe('TOKEN_AUSENTE');
      expect(actualizarProductoApplicationService.ejecutar).not.toHaveBeenCalled();
    });

    it('debería retornar 403 si usuario no es administrador', async () => {
      /**
       * Fase 3: Validar que middleware de rol sea aplicado
       * - Solo administradores pueden actualizar
       */
      const tokenCliente = generarTokenTest('cliente');
      const response = await request(app)
        .put('/productos/1')
        .set('Authorization', `Bearer ${tokenCliente}`)
        .send({ nombre: 'Nuevo', precio: 15000 });

      expect(response.status).toBe(403);
      expect(response.body.codigo).toBe('ACCESO_DENEGADO');
      expect(actualizarProductoApplicationService.ejecutar).not.toHaveBeenCalled();
    });

    it('debería retornar 400 si precio no es positivo', async () => {
      /**
       * Fase 2: Validación de negocio
       * - precio debe ser positivo
       */
      const tokenAdmin = generarTokenTest('administrador');
      const response = await request(app)
        .put('/productos/1')
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .send({ nombre: 'Nuevo', precio: -5000 });

      expect(response.status).toBe(400);
      expect(response.body.codigo).toBe('VALIDACION_ERROR');
    });

    it('debería retornar 200 cuando actualización es exitosa', async () => {
      /**
       * Fase 2 & 3: Caso de éxito
       * - Usuario autenticado como administrador
       * - Precio válido
       */
      const tokenAdmin = generarTokenTest('administrador');
      const mockResult = { idProducto: 1, nombre: 'Teclado Pro' };
      actualizarProductoApplicationService.ejecutar.mockResolvedValue(
        mockResult
      );

      const response = await request(app)
        .put('/productos/1')
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .send({
          nombre: 'Teclado Pro',
          precio: 25000,
          minStock: 5,
          descripcion: 'Teclado mecánico',
          imagenUrl: 'url',
          idCategoria: 2
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(actualizarProductoApplicationService.ejecutar).toHaveBeenCalledWith(
        expect.objectContaining({
          idProducto: 1,
          nombre: 'Teclado Pro',
          precio: 25000
        })
      );
    });
  });

  describe('DELETE /productos/:id', () => {
    it('debería retornar 401 si no hay token', async () => {
      /**
       * Fase 3: Validar autenticación
       */
      const response = await request(app).delete('/productos/1');

      expect(response.status).toBe(401);
      expect(response.body.codigo).toBe('TOKEN_AUSENTE');
      expect(eliminarProductoApplicationService.ejecutar).not.toHaveBeenCalled();
    });

    it('debería retornar 403 si usuario no es administrador', async () => {
      /**
       * Fase 3: Validar autorización
       */
      const tokenCliente = generarTokenTest('cliente');
      const response = await request(app)
        .delete('/productos/1')
        .set('Authorization', `Bearer ${tokenCliente}`);

      expect(response.status).toBe(403);
      expect(response.body.codigo).toBe('ACCESO_DENEGADO');
      expect(eliminarProductoApplicationService.ejecutar).not.toHaveBeenCalled();
    });

    it('debería retornar 200 cuando eliminación es exitosa', async () => {
      /**
       * Fase 2 & 3: Caso de éxito
       */
      const tokenAdmin = generarTokenTest('administrador');
      const mockResult = { idProducto: 1, mensaje: 'Eliminado' };
      eliminarProductoApplicationService.ejecutar.mockResolvedValue(
        mockResult
      );

      const response = await request(app)
        .delete('/productos/1')
        .set('Authorization', `Bearer ${tokenAdmin}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(eliminarProductoApplicationService.ejecutar).toHaveBeenCalledWith({
        idProducto: 1
      });
    });
  });
});
