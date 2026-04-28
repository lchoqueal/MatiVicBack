/**
 * Emitir eventos en tiempo real a través de Socket.IO
 * Se inyecta en Application Services para notificar cambios
 */
class SocketIOEmitter {
  constructor(io) {
    this.io = io;
  }

  /**
   * Emitir cuando el stock de un producto cambia
   */
  emitirStockActualizado(producto) {
    this.io.emit('stock-actualizado', {
      idProducto: producto.id,
      stock: producto.stock,
      nombre: producto.nombre,
      timestamp: new Date()
    });
  }

  /**
   * Emitir cuando se crea una boleta
   */
  emitirBoletaCreada(boleta) {
    this.io.emit('boleta-creada', {
      idBoleta: boleta.id,
      tipo: boleta.tipoVenta,
      total: boleta.total,
      timestamp: new Date()
    });
  }

  /**
   * Emitir cuando un producto tiene stock bajo
   */
  emitirAlertaStockBajo(producto) {
    this.io.emit('alerta-stock-bajo', {
      idProducto: producto.id,
      nombre: producto.nombre,
      stock: producto.stock,
      minStock: producto.minStock,
      timestamp: new Date()
    });
  }

  /**
   * Emitir a un cliente/empleado específico
   */
  emitirAlUsuario(usuarioId, evento, datos) {
    this.io.to(`usuario-${usuarioId}`).emit(evento, {
      ...datos,
      timestamp: new Date()
    });
  }
}

module.exports = SocketIOEmitter;
