const Producto = require('../../../src/modules/producto/domain/entities/Producto');

class ProductoTestingAPI {
  constructor() {
    this.productos = [];
    this.siguienteId = 1;
  }

  registrarProducto(datos) {
    const producto = new Producto(
      this.siguienteId++,
      datos.nombre,
      datos.precio,
      datos.stock,
      datos.minStock || 0,
      datos.descripcion || '',
      datos.imagenUrl || '',
      datos.idCategoria || null
    );

    producto.validar();
    this.productos.push(producto);

    return {
      exito: true,
      producto,
      mensaje: 'Producto registrado con exito'
    };
  }

  intentarRegistrarProducto(datos) {
    try {
      return this.registrarProducto(datos);
    } catch (error) {
      return {
        exito: false,
        error: error.message,
        producto: null
      };
    }
  }

  obtenerUltimoProducto() {
    return this.productos[this.productos.length - 1] || null;
  }
}

module.exports = ProductoTestingAPI;
