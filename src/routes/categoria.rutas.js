'use strict'
const express = require("express");
const categoriaControlador = require("../controllers/categoria.controlador");

var md_autenticador = require("../midlewares/authenticated");
var api = express.Router();

api.post('/agregarCategoria', md_autenticador.ensureAuth, categoriaControlador.agregarCategoria);

api.get('/obtenerCategorias', md_autenticador.ensureAuth, categoriaControlador.obtenerCategorias);

api.put('/editarCategoria/:idCategoria', md_autenticador.ensureAuth, categoriaControlador.editarCategoria);

api.delete('/eliminarCategoria/:idCategoria', md_autenticador.ensureAuth, categoriaControlador.eliminarCategoria);
module.exports = api;