const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Middleware
const errorHandler = require('./shared/middleware/errorHandler');
const SocketIOEmitter = require('./shared/infrastructure/realtime/SocketIOEmitter');

//Modulos

const moduloUsuario = require('./modules/usuario');
const moduloCategoria = require('./modules/categoria');
const moduloProducto = require('./modules/producto');
const moduloCarrito = require('./modules/carrito');
const moduloBoleta = require('./modules/boleta');
const moduloReporte = require('./modules/reporte');
const moduloCliente = require('./modules/cliente');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

const socketIOEmitter = new SocketIOEmitter(io);

app.use('/categorias', moduloCategoria());
app.use('/auth', moduloUsuario());
const productoModule = moduloProducto(socketIOEmitter);
app.use('/productos', productoModule.productoRoutes);
app.use('/productos/alertas', productoModule.alertasRoutes);
app.use('/carrito', moduloCarrito(socketIOEmitter));
app.use('/boleta', moduloBoleta(socketIOEmitter));
app.use('/reportes', moduloReporte());
app.use('/cliente', moduloCliente(socketIOEmitter));

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

module.exports = { app, httpServer, io };