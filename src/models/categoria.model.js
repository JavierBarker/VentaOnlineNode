'use strict'
const mongoose = require("mongoose");
var  Schema = mongoose.Schema;

var CategoriaSchema = Schema({
    nombre      : {type: String, required: true},
    descripcion : {type: String, required: true}
})

module.exports = mongoose.model('categorias', CategoriaSchema);