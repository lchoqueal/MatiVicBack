const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Middleware
const errorHandler = require('./shared/middleware/errorHandler');

// Repositories
const UsuarioRepository = require('./usuario/infrastructure/UsuarioRepository');
const ProductoRepository = require('./producto/infrastructure/ProductoRepository');
const CarritoRepository = require('./carrito/infrastucture/CarritoRepository');
const BoletaRepository = require('./boleta/infrastructure/BoletaRepository');
const ClienteRepository = require('./cliente/infrastructure/ClienteRepository');

// Application Services
const AutenticacionApplicationService = require('./usuario/application/AutenticacionApplicationService');
const CrearBoletaApplicationService = require('./boleta/application/CrearBoletaApplicationService');
const AgregarProductoCarritoApplicationService = require('./carrito/application/AgregarProductoCarritoApplicationService');
const ObtenerProductosApplicationService = require('./producto/application/ObtenerProductosApplicationService');
const ObtenerReportesApplicationService = require('./reporte/application/ObtenerReportesApplicationService');
const ObtenerAlertasApplicationService = require('./producto/application/ObtenerAlertasApplicationService');
const ActualizarProductoApplicationService = require('./producto/application/ActualizarProductoApplicationService');
const EliminarProductoApplicationService = require('./producto/application/EliminarProductoApplicationService');

// Real-time
const SocketIOEmitter = require('./shared/infrastructure/realtime/SocketIOEmitter');

// Routes
const registrarRutas = require('./presentation/routes');

// Crear Express app + HTTP server + Socket.IO
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Socket.IO - Conexiones
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Cliente conectado: ${socket.id}`);

  // Unir usuario a sala privada
  socket.on('unirse-como-usuario', (usuarioId) => {
    socket.join(`usuario-${usuarioId}`);
    console.log(`[Socket.IO] Usuario ${usuarioId} unido a su sala privada`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Cliente desconectado: ${socket.id}`);
  });
});

// ===== INYECCIÓN DE DEPENDENCIAS =====

// 1. Crear repositories
const usuarioRepository = new UsuarioRepository();
const productoRepository = new ProductoRepository();
const carritoRepository = new CarritoRepository();
const boletaRepository = new BoletaRepository();
const clienteRepository = new ClienteRepository();

const repositories = {
  usuarioRepository,
  productoRepository,
  carritoRepository,
  boletaRepository,
  clienteRepository
};

// 2. Crear SocketIOEmitter
const socketIOEmitter = new SocketIOEmitter(io);

// 3. Crear Application Services
const autenticacionApplicationService = new AutenticacionApplicationService(usuarioRepository);
const crearBoletaApplicationService = new CrearBoletaApplicationService(
  boletaRepository,
  carritoRepository,
  productoRepository,
  socketIOEmitter
);
const agregarProductoCarritoApplicationService = new AgregarProductoCarritoApplicationService(
  carritoRepository,
  productoRepository,
  socketIOEmitter
);
const obtenerProductosApplicationService = new ObtenerProductosApplicationService(productoRepository);
const obtenerReportesApplicationService = new ObtenerReportesApplicationService(
  boletaRepository,
  productoRepository
);
const obtenerAlertasApplicationService = new ObtenerAlertasApplicationService(
  productoRepository,
  socketIOEmitter
);
const actualizarProductoApplicationService = new ActualizarProductoApplicationService(
  productoRepository,
  socketIOEmitter
);
const eliminarProductoApplicationService = new EliminarProductoApplicationService(
  productoRepository
);

const applicationServices = {
  autenticacionApplicationService,
  crearBoletaApplicationService,
  agregarProductoCarritoApplicationService,
  obtenerProductosApplicationService,
  obtenerReportesApplicationService,
  obtenerAlertasApplicationService,
  actualizarProductoApplicationService,
  eliminarProductoApplicationService
};

// 4. Registrar rutas
registrarRutas(app, repositories, applicationServices, socketIOEmitter);

// Middleware de error (DEBE estar al final)
app.use(errorHandler);

// ===== INICIAR SERVIDOR =====
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ MatiVicBack iniciado exitosamente`);
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  console.log(`📡 Socket.IO escuchando en ws://localhost:${PORT}`);
  console.log(`🏠 http://localhost:${PORT}/health`);
  console.log(`${'='.repeat(50)}\n`);
});

// Exportar para testing
module.exports = { app, httpServer, io };
