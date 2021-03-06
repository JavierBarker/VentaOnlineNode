'use strict'
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const adminControlador = require("./src/controllers/admin.controller");

//Importamos las Rutas
const global_rutas = require("./src/routes/global.rutas");
const categoria_rutas = require("./src/routes/categoria.rutas");

//Crea ADMIN
adminControlador.registrarAdmin();

//Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Cabeceras
app.use(cors());

//Cargamos las rutas
app.use('/api', global_rutas, categoria_rutas);


//Exportamos todo
module.exports = app;