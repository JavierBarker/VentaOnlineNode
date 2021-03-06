'use strict'
const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AdminSchema = Schema({
    usuario     : {type: String, required: true},//el required indica que se requiere ese campo
    nombre      : {type: String, required: true},
    password    : {type: String, required: true},
    rol         : {type: String, required: true}
})

module.exports = mongoose.model('admins', AdminSchema);