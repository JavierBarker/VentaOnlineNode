'use strict'
const { model } = require("mongoose");
const Categoria = require("../models/categoria.model");

function agregarCategoria(req, res) {
    var params = req.body;
    var categoriaModelo = new Categoria();
    if ((req.user.rol === 'ROL_ADMIN')) {
        if(params.nombre && params.descripcion){
            categoriaModelo.nombre = params.nombre;
            categoriaModelo.descripcion = params.descripcion;

            Categoria.find({ $or:[
                {nombre: categoriaModelo.nombre},
                {descripcion: categoriaModelo.descripcion}
            ]}).exec((err, categoriaEncontrada)=>{
                if (err) return res.status(500).send({mensaje: 'Error en la peticion de la Categoría'});
                if (categoriaEncontrada && categoriaEncontrada.length >=1){
                    return res.status(500).send({mensaje: 'La Categoría ya Existe'});
                }else{
                    categoriaModelo.save((err, categoriaGuardada) =>{
                        if (err) return res.status(500).send({mensaje: 'Error en la peticion de la Categoria'});
                        if (!categoriaGuardada) return res.status(500).send({mensaje: 'Error al Guardar Categoría'});
                        return res.status(200).send({categoriaGuardada});
                    })
                }
            })
        }
    }else{
        return res.status(500).send({mensaje: 'No tiene los Permisos Necesarios'});
    }
}

//me quede en agregar categoria
module.exports = {
    agregarCategoria
}