'use strict'
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PoductoSchema = Schema({
    nombre          :{type: String, required: true},
    stock           :{type: Number, required: true},
    precio          :{type: Number, required: true},
    categoria       :{type: Schema.Types.ObjectId, ref: 'categorias', required: true},
    cantidadComprada:{type: Number, required: true}
})

module.exports = mongoose.model('productos', PoductoSchema);