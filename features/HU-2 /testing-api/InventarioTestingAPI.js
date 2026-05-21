class InventarioTestingAPI {
  constructor() {
    this.reset();
  }

  reset() {
    this.inventario = {};
    this.errorCapturado = null;
  }

  establecerStock(codigo, stockInicial) {
    this.inventario = {};
    this.inventario[codigo] = stockInicial;
    this.errorCapturado = null;
  }

  procesarMovimiento(operacion, cantidad) {
    const codigoProducto = Object.keys(this.inventario)[0];

    if (operacion === 'venta') {
      this.inventario[codigoProducto] -= cantidad;
      return;
    }

    if (operacion === 'compra') {
      this.inventario[codigoProducto] += cantidad;
      return;
    }

    throw new Error(`Operación no reconocida: ${operacion}`);
  }

  intentarProcesarVenta(operacion, cantidad) {
    const codigoProducto = Object.keys(this.inventario)[0];

    try {
      if (operacion === 'venta') {
        if (this.inventario[codigoProducto] < cantidad) {
          throw new Error('Stock insuficiente');
        }

        this.inventario[codigoProducto] -= cantidad;
      }
    } catch (error) {
      this.errorCapturado = error.message;
    }
  }

  obtenerStockActual() {
    const codigoProducto = Object.keys(this.inventario)[0];
    return this.inventario[codigoProducto];
  }

  obtenerStock(codigo) {
    return this.inventario[codigo];
  }
}

module.exports = new InventarioTestingAPI();