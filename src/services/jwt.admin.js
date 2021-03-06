'use strict'

var jwt = require("jwt-simple");
var moment = require("moment");
var secret = 'CLAVE_SECRETA_VENTA_ONLINE';

exports.createToken = function(usuario){
    var payload = {
        sub     : usuario._id,
        usuario : usuario.usuario,
        nombre  : usuario.nombre,
        rol     : usuario.rol,
        iat     : moment().unix(),
        exp     : moment().day(10, 'days').unix()
    }
    return jwt.encode(payload, secret);
} 