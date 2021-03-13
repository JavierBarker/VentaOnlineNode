'use strict'
const express = require("express");
const usuarioControlador = require("../controllers/usuario.controlador");
var md_autenticador = require("../midlewares/authenticated");
var api = express.Router();

api.post('/login', usuarioControlador.login);

api.post('/registrarUsuarioConAdmin', md_autenticador.ensureAuth, usuarioControlador.registrarUsuarioConAdmin);

api.put('/editarUsuarioConAdmin/:idUsuario', md_autenticador.ensureAuth, usuarioControlador.editarUsuarioConAdmin);

api.delete('/eliminarUsuarioConAdmin/:idUsuario', md_autenticador.ensureAuth, usuarioControlador.eliminarUsuarioConAdmin);



//FUNCIONES DEL CLIENTE
api.post('/registrarCliente', usuarioControlador.registrarCliente);

api.get('/productosMasVendidos', md_autenticador.ensureAuth, usuarioControlador.productosMasVendidos);

api.post('/buscarProductoPorNombre', md_autenticador.ensureAuth, usuarioControlador.buscarProductoPorNombre);

api.get('/productosEnCategoria/:idCategoria', md_autenticador.ensureAuth, usuarioControlador.productosEnCategoria);

api.put('/agregarAlCarrito/:idProducto', md_autenticador.ensureAuth, usuarioControlador.agregarAlCarrito);



api.put('/editarCliente', md_autenticador.ensureAuth, usuarioControlador.editarCliente);

api.delete('/eliminarCliente', md_autenticador.ensureAuth, usuarioControlador.eliminarCliente);
module.exports = api;