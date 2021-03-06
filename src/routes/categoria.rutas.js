'use strict'
const express = require("express");
const categoriaControlador = require("../controllers/categoria.controlador");

var md_autenticador = require("../midlewares/authenticated");
var api = express.Router();

api.post('/agregarCategoria', md_autenticador.ensureAuth, categoriaControlador.agregarCategoria);

module.exports = api;