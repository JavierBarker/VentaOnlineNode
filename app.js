'use strict'
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const usuarioCotrolador = require("./src/controllers/usuario.controlador");

//Importamos las Rutas
const usuario_rutas = require("./src/routes/usuario.rutas");
const categoria_rutas = require("./src/routes/categoria.rutas");
const producto_rutas = require("./src/routes/producto.rutas");

//Crea ADMIN
usuarioCotrolador.registrarAdmin();

//Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Cabeceras
app.use(cors());

//Cargamos las rutas
app.use('/api', usuario_rutas, categoria_rutas, producto_rutas);


//Exportamos todo
module.exports = app;