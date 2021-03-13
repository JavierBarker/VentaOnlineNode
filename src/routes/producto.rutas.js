'use strict'
const express = require("express");
const productoControlador = require("../controllers/producto.controlador");

var md_autenticador = require("../midlewares/authenticated");
var api = express.Router();

api.post('/agregarProducto/:idCategoria', md_autenticador.ensureAuth, productoControlador.agregarProducto);

api.get('/obtenerProductoById/:idProducto', md_autenticador.ensureAuth, productoControlador.obtenerProductoById);

api.get('/obtenerProductos', md_autenticador.ensureAuth, productoControlador.obtenerProductos);

api.put('/editarProducto/:idProducto', md_autenticador.ensureAuth, productoControlador.editarProducto);

api.get('/controlDeStock/:idProducto', md_autenticador.ensureAuth, productoControlador.controlDeStock);

api.delete('/eliminarProducto/:idProducto', md_autenticador.ensureAuth, productoControlador.eliminarProducto);

api.get('/visualizarProductosAgotados', md_autenticador.ensureAuth, productoControlador.visualizarProductosAgotados)
module.exports = api;
