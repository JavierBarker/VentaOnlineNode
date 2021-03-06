'use strict'
const express = require("express");
const globalControlador = require("../controllers/global.controlador");

var api = express.Router();

api.post('/login', globalControlador.login);

module.exports = api;
