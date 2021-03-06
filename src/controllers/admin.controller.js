'use strict'

const Admin = require("../models/admin.model");
const bcrypt = require("bcrypt-nodejs");
const jwtAdmin = require("../services/jwt.admin");

function registrarAdmin(req, res) {
    var adminModelo = new Admin();

    adminModelo.usuario = "ADMIN";
    adminModelo.nombre = "ADMIN";
    adminModelo.rol = "ROL_ADMIN";

    Admin.find({$or:[
        {usuario: adminModelo.usuario},
        {nombre: adminModelo.nombre}
    ]}).exec((err, adminEncontrado)=>{
        if(err) return console.log('Error al Buscar ADMIN');
        if(adminEncontrado && adminEncontrado.length >= 1){
            console.log('El ADMIN ya Existe');
        }else{
            bcrypt.hash("123456", null, null, (err, passEncriptada)=>{
                adminModelo.password = passEncriptada;

                adminModelo.save((err, adminGuardado)=>{
                    if(err) return console.log('Error al Guardar ADMIN');
                    if(adminGuardado){
                        console.log(adminGuardado);
                    }else{
                        console.log('No se registro el Admin');
                    }
                })
            })
        }
    })
}
//me quede en el login


module.exports = {
    registrarAdmin
}