'use strict'
const express = require("express");
const productoControlador = require("../controllers/producto.controlador");

var md_autenticador = require("../midlewares/authenticated");
var api = express.Router();

api.post('/agregarProducto/:idCategoria', md_autenticador.ensureAuth, productoControlador.agregarProducto);

module.exports = api;
