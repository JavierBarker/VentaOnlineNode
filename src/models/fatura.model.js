'use strict'
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FacturaSchema = Schema({
    productos:[{
        nombre    :{type: String, required: true},
        cantidad  :{type: Number, required: true},
        precio    :{type: Number, required: true},
        subTotal  :{type: Number, required: true},
        idProducto:{type: Schema.Types.ObjectId, ref: 'productos', required: true},
    }],
    total    :{type: Number, required: true},
})

module.exports = mongoose.model('facturas', FacturaSchema);