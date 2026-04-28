const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Middleware
const errorHandler = require('./middleware/errorHandler');

// Repositories
const UsuarioRepository = require('./infrastructure/persistence/UsuarioRepository');
const ProductoRepository = require('./infrastructure/persistence/ProductoRepository');
const CarritoRepository = require('./infrastructure/persistence/CarritoRepository');
const BoletaRepository = require('./infrastructure/persistence/BoletaRepository');
const ClienteRepository = require('./infrastructure/persistence/ClienteRepository');

// Application Services
const AutenticacionApplicationService = require('./application/services/AutenticacionApplicationService');
const CrearBoletaApplicationService = require('./application/services/CrearBoletaApplicationService');
const AgregarProductoCarritoApplicationService = require('./application/services/AgregarProductoCarritoApplicationService');
const ObtenerProductosApplicationService = require('./application/services/ObtenerProductosApplicationService');
const ObtenerReportesApplicationService = require('./application/services/ObtenerReportesApplicationService');
const ObtenerAlertasApplicationService = require('./application/services/ObtenerAlertasApplicationService');
const ActualizarProductoApplicationService = require('./application/services/ActualizarProductoApplicationService');
const EliminarProductoApplicationService = require('./application/services/EliminarProductoApplicationService');

// Real-time
const SocketIOEmitter = require('./infrastructure/realtime/SocketIOEmitter');

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
