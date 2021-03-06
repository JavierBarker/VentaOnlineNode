'use strict'
var jwt = require("jwt-simple");
var moment = require("moment");
var secret = 'CLAVE_SECRETA_VENTA_ONLINE';

exports.ensureAuth = function (req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send({mensaje: 'No trae la cabecera de Autorización'});
    }

    var token = req.headers.authorization.replace(/['"]+/g,'');

    try {
        var payload = jwt.decode(token, secret);
        if (payload.exp <= moment().unix()) {
            return res.status(401).send({mensaje: 'El Token ha Expirado'});
        }
    } catch (error) {
        return res.status(404).send({mensaje: 'El Token no es Valido'});
    }

    req.user = payload;
    next();
}