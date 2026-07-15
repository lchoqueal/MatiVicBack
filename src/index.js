require('../tracing');
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

// Middleware para recopilar métricas HTTP de Prometheus
const { register, httpRequestsTotal, httpRequestDurationSeconds } = require('./shared/infrastructure/monitoring/metrics');

app.use((req, res, next) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const duration = process.hrtime(start);
    const durationSeconds = duration[0] + duration[1] / 1e9;
    
    // Normalizar la ruta para evitar ensuciar Prometheus con IDs dinámicos (ej: /productos/12 -> /productos/:id)
    let route = req.path;
    if (req.params && Object.keys(req.params).length > 0) {
      Object.keys(req.params).forEach(key => {
        route = route.replace(req.params[key], `:${key}`);
      });
    }
    // Reemplazar IDs numéricos genéricos por regex si no se resolvieron
    route = route.replace(/\/\d+/g, '/:id');

    // Registrar métricas
    httpRequestsTotal.inc({ method: req.method, route, status: res.statusCode });
    httpRequestDurationSeconds.observe({ method: req.method, route, status: res.statusCode }, durationSeconds);
  });

  next();
});

// Endpoint público para exponer las métricas recolectadas
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

app.use('/categorias', moduloCategoria());
app.use('/auth', moduloUsuario());
app.use('/productos', moduloProducto(socketIOEmitter));
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