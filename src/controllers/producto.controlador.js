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
        }else{
            return res.status(500).send({mensaje: 'Rellene los datos necesarios para crear El Oproducto'});
        }
    }else{
        return res.status(500).send({mensaje: 'No tiene los Permisos Necesarios'});
    }
}

function obtenerProductoById(req, res) {
    var idProducto = req.params.idProducto;
    if (req.user.rol === "ROL_ADMIN") {
        Producto.findById(idProducto).populate('categoria', '_id nombre descripcion').exec((err, productoEncontrado)=>{
            if (err) return res.status(500).send({mensaje: 'Error en la peticion del Producto'});
            if (!productoEncontrado) return res.status(500).send({mensaje: 'Error al Buscar Producto'});
            return res.status(200).send({productoEncontrado});
        })
    }else{
        return res.status(500).send({mensaje: 'No tiene los Permisos Necesarios'});
    }
}

function obtenerProductos(req, res) {
    if (req.user.rol === "ROL_ADMIN") {
        Producto.find().populate('categoria', '_id nombre descripcion').exec((err, productosEncontrados)=>{
            if (err) return res.status(500).send({mensaje: 'Error en la peticion del Producto'});
            if (!productosEncontrados) return res.status(500).send({mensaje: 'Error al Buscar Productos'});
            return res.status(200).send({productosEncontrados});
        })
    }else{
        return res.status(500).send({mensaje: 'No tiene los Permisos Necesarios'});
    }
}


function editarProducto(req, res) {
    var idProducto = req.params.idProducto;
    var params = req.body;
    if (req.user.rol === "ROL_ADMIN") {
        Producto.find({ $or:[
            {nombre: params.nombre}
        ]}).exec((err, productoEncontrado)=>{
            if (err) return res.status(500).send({mensaje: 'Error en la peticion del Producto'});

            if (productoEncontrado && productoEncontrado.length >= 1){
                return res.status(500).send({mensaje: 'No se puede editar un Producto con un Nombre Igual a otro Producto'});
            }else{
                Producto.findByIdAndUpdate(idProducto, params, {new: true, useFindAndModify: false}, (err, productoActualizado)=>{
                    if (err) return res.status(500).send({mensaje: 'Error en la peticion del Producto'});
                    if (!productoActualizado) return res.status(500).send({mensaje: 'Error al Editar el Producto'});
                    return res.status(200).send({productoActualizado});
                })
            }
        })
    }else{
        return res.status(500).send({mensaje: 'No tiene los Permisos Necesarios'});
    }
}

function controlDeStock(req, res) {
    var idProducto = req.params.idProducto;
    if (req.user.rol === "ROL_ADMIN") {
        Producto.findById(idProducto).populate('categoria', '_id nombre descripcion').exec((err, productoEncontrado)=>{
            if (err) return res.status(500).send({mensaje: 'Error en la peticion Producto'});
            if (!productoEncontrado) return res.status(500).send({mensaje: 'Error al Buscar el Producto'});
            if (productoEncontrado.stock <= 0) {
                return res.status(200).send({estado: 'Agotado', productoEncontrado});
            }else{
                return res.status(200).send({estado: 'Disponible', productoEncontrado});
            }
        })
    }else{
        return res.status(500).send({mensaje: 'No tiene los Permisos Necesarios'});
    }
}

function eliminarProducto(req, res) {
    var idProducto = req.params.idProducto;
    if (req.user.rol === "ROL_ADMIN") {
        Producto.findByIdAndRemove(idProducto, {useFindAndModify: false}, (err, productoEliminado)=>{
            if (err) return res.status(500).send({mensaje: 'Error en la peticion Producto'});
            if (!productoEliminado) return res.status(500).send({mensaje: 'Error al Eliminar Producto'});
            return res.status(200).send({mensaje: 'Producto Eliminado',productoEliminado});
        })
    }else{
        return res.status(500).send({mensaje: 'No tiene los Permisos Necesarios'});
    }
}
module.exports = {
    agregarProducto,
    obtenerProductoById,
    obtenerProductos,
    editarProducto,
    controlDeStock,
    eliminarProducto
}