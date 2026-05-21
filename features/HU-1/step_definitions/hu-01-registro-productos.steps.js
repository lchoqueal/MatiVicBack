const { Before, Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const ProductoTestingAPI = require('../testing-api/ProductoTestingAPI');

Before(function () {
  this.productoTestingAPI = new ProductoTestingAPI();
  this.resultado = null;
  this.producto = null;
});

Given('que el responsable de inventario tiene un producto listo para registrar', function () {
  this.datosProducto = {
    nombre: 'Cargador 20W',
    descripcion: 'Cargador tipo C de pared',
    codigo: 'PROD-001',
    categoria: 'Accesorios',
    precio: 45.5,
    stock: 10,
    minStock: 2
  };
});

When('registra un producto con nombre, descripción, código, categoría, precio y stock válidos', function () {
  this.resultado = this.productoTestingAPI.registrarProducto({
    nombre: this.datosProducto.nombre,
    descripcion: this.datosProducto.descripcion,
    imagenUrl: '',
    idCategoria: this.datosProducto.categoria,
    precio: this.datosProducto.precio,
    stock: this.datosProducto.stock,
    minStock: this.datosProducto.minStock
  });

  this.producto = this.resultado.producto;
});

Then('el sistema incorpora el producto al inventario', function () {
  assert.strictEqual(this.resultado.exito, true);
  assert.ok(this.producto);
  assert.strictEqual(this.productoTestingAPI.productos.length, 1);
});

Then('confirma que el producto quedó disponible para su gestión', function () {
  const producto = this.productoTestingAPI.obtenerUltimoProducto();

  assert.ok(producto);
  assert.strictEqual(producto.estado, 'activo');
  assert.strictEqual(producto.nombre, this.datosProducto.nombre);
});

Given('que el responsable de inventario prepara un producto nuevo', function () {
  this.datosInvalidos = {
    nombre: '',
    descripcion: 'Producto sin nombre',
    codigo: 'PROD-002',
    categoria: 'Accesorios',
    precio: 45.5,
    stock: 10,
    minStock: 0
  };
});

When('intenta registrarlo con datos obligatorios incompletos o inválidos', function () {
  this.resultado = this.productoTestingAPI.intentarRegistrarProducto({
    nombre: this.datosInvalidos.nombre,
    descripcion: this.datosInvalidos.descripcion,
    imagenUrl: '',
    idCategoria: this.datosInvalidos.categoria,
    precio: this.datosInvalidos.precio,
    stock: this.datosInvalidos.stock,
    minStock: this.datosInvalidos.minStock
  });
});

Then('el sistema no registra el producto', function () {
  assert.strictEqual(this.resultado.exito, false);
  assert.strictEqual(this.productoTestingAPI.productos.length, 0);
});

Then('muestra un aviso indicando que los datos deben revisarse', function () {
  assert.ok(this.resultado.error);
  assert.match(this.resultado.error, /Nombre de producto requerido/);
});
