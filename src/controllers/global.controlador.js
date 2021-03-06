'use strict'
const Admin = require("../models/admin.model");
const jwtAdmin = require("../services/jwt.admin");
const bcrypt = require("bcrypt-nodejs");

function login(req, res) {
    var params = req.body;
    if (params.rol === 'ROL_ADMIN') {
        Admin.findOne({usuario: params.usuario}, (err, adminEncontrado)=>{
            if (err) return res.status(500).send({mensaje: 'Error en la peticion Login'});
    
            if(adminEncontrado){
                bcrypt.compare(params.password, adminEncontrado.password, (err, passCorrecta)=>{
                    if (passCorrecta) {
                        if (params.getToken === 'true') {
                            return res.status(200).send({token: jwtAdmin.createToken(adminEncontrado)});
                        }else{
                            adminEncontrado.password = undefined;
                            return res.status(200).send({adminEncontrado});
                        }
                    }else{
                        return res.status(404).send({mensaje: 'El Usuario o Contraseña son Erróneos', err});
                    }
                })
            }else{
                return res.status(404).send({mensaje: 'El ADMIN no se ha podido ingresar'});
            }
        })
    }else if (params.rol === 'ROL_CLIENTE') {
        return res.status(404).send({mensaje: 'HOLA'});
    }else{
        return res.status(404).send({mensaje: 'Coloque ROL_ADMIN o ROL_CLIENTE en el Rol'});
    }
    
}

module.exports = {
    login
}