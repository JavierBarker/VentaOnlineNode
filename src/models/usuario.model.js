'use strict'
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClienteSchema = Schema({
    nombre          :{type: String, required: true},
    usuario         :{type: String, required: true},
    password        :{type: String, required: true},
    rol             :{type: String, required: true},
    carritoDeCompras:{
        productos:[{
            nombre    :{type: String, required: true},
            cantidad  :{type: Number, required: true},
            precio    :{type: Number, required: true},
            subTotal  :{type: Number, required: true},
            idProducto:{type: Schema.Types.ObjectId, ref: 'productos', required: true},
        }],
        total    :{type: Number, required: true},
    }
})

module.exports = mongoose.model('usuarios', ClienteSchema);