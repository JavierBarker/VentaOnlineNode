'use strict'
const Producto = require('../models/producto.model');

function agregarProducto(req, res) {
    var params = req.body;
    var idCategoria = req.params.idCategoria;
    var productoModelo = new Producto();

    if (req.user.rol === 'ROL_ADMIN') {
        if(params.nombre && params.stock && params.precio){
            productoModelo.nombre = params.nombre;
            productoModelo.stock = params.stock;
            productoModelo.precio = params.precio;
            productoModelo.categoria = idCategoria;
            productoModelo.cantidadComprada = 0;

            Producto.find({ $or:[
                {nombre: productoModelo.nombre}
            ]}).exec((err, productoEncontrado)=>{
                if (err) return res.status(500).send({mensaje: 'Error en la peticion del Producto'});
                if (productoEncontrado && productoEncontrado.length >=1){
                    return res.status(500).send({mensaje: 'El Producto ya Existe'});
                }else{
                    productoModelo.save((err, productoGuardado) =>{
                        if (err) return res.status(500).send({mensaje: 'Error en la peticion del Producto'});
                        if (!productoGuardado) return res.status(500).send({mensaje: 'Error al Guardar Producto'});
                        return res.status(200).send({productoGuardado});
                    })
                }
            })
        }
    }else{
        return res.status(500).send({mensaje: 'No tiene los Permisos Necesarios'});
    }
}
//me quede en agregar Producto
module.exports = {
    agregarProducto
}