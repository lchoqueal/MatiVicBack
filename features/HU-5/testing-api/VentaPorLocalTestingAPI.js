class VentaPorLocalTestingAPI {
  constructor() {
    this.sesionCaja = null;
    this.transacciones = [];
    this.siguienteId = 1;

    this.productos = {
      'PROD-001': { codigo: 'PROD-001', nombre: 'Cargador 20W', precioUnitario: 45.5, stock: 50 },
      'PROD-002': { codigo: 'PROD-002', nombre: 'Cable HDMI 2m', precioUnitario: 25.0, stock: 30 }
    };
  }

  iniciarSesionCaja(localOrigen) {
    this.sesionCaja = {
      localOrigen,
      cajero: 'cajero-demo'
    };

    return this.sesionCaja;
  }

  registrarVenta(codigo, cantidad) {
    if (!this.sesionCaja) {
      throw new Error('No existe una sesión de caja activa');
    }

    const producto = this.productos[codigo];

    if (!producto) {
      throw new Error('Producto no encontrado');
    }

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      throw new Error('Cantidad inválida para la venta');
    }

    if (producto.stock < cantidad) {
      throw new Error('Stock insuficiente para completar la venta');
    }

    const total = Number((producto.precioUnitario * cantidad).toFixed(2));
    producto.stock -= cantidad;

    const transaccion = {
      idTransaccion: this.siguienteId++,
      localOrigen: this.sesionCaja.localOrigen,
      codigoProducto: codigo,
      cantidad,
      total
    };

    this.transacciones.push(transaccion);

    return {
      exito: true,
      mensaje: 'Venta registrada exitosamente',
      transaccion,
      stockRestante: producto.stock
    };
  }

  intentarRegistrarVenta(codigo, cantidad) {
    try {
      return this.registrarVenta(codigo, cantidad);
    } catch (error) {
      return {
        exito: false,
        error: error.message,
        transaccion: null
      };
    }
  }

  obtenerUltimaTransaccion() {
    return this.transacciones[this.transacciones.length - 1] || null;
  }
}

module.exports = VentaPorLocalTestingAPI;
