'use strict'
const Categoria = require("../models/categoria.model");
const Producto = require("../models/producto.model");

function agregarCategoria(req, res) {
    var params = req.body;
    var categoriaModelo = new Categoria();
    if ((req.user.rol === 'ROL_ADMIN')) {
        if(params.nombre && params.descripcion){
            categoriaModelo.nombre = params.nombre;
            categoriaModelo.descripcion = params.descripcion;

            Categoria.find({ $or:[
                {nombre: categoriaModelo.nombre}
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
        }else{
            return res.status(500).send({mensaje: 'Rellene los datos necesarios para crear la Categoria'});
        }
    }else{
        return res.status(500).send({mensaje: 'No tiene los Permisos Necesarios'});
    }
}

function obtenerCategorias(req, res){
    if (req.user.rol === "ROL_ADMIN" || req.user.rol === "ROL_CLIENTE") {
        Categoria.find((err, categoriasEncontradas) =>{
            if (err) return res.status(500).send({mensaje: 'Error en la peticion de la Categoria'});
            if (!categoriasEncontradas) return res.status(500).send({mensaje: 'Error al Buscar Categorias'});
            return res.status(200).send({categoriasEncontradas});
        })
    }else{
        return res.status(500).send({mensaje: 'No tiene los Permisos Necesarios'});
    }

}

function editarCategoria(req, res) {
    var idCategoria = req.params.idCategoria;
    var params = req.body;
    if (req.user.rol === "ROL_ADMIN") {
        Categoria.find({ $or:[
            {nombre: params.nombre}
        ]}).exec((err, categoriaEncontrada)=>{
            if (err) return res.status(500).send({mensaje: 'Error en la peticion de la Categoria'});
            
            if (categoriaEncontrada && categoriaEncontrada.length >= 1){
                return res.status(500).send({mensaje: 'No se puede editar una Categoria con un Nombre Igual a otra Categoria'});
            }else{
                Categoria.findByIdAndUpdate(idCategoria, params, {new: true, useFindAndModify: false}, (err, categoriaActualizada)=>{
                    if (err) return res.status(500).send({mensaje: 'Error en la peticion de la Categoria'});
                    if (!categoriaActualizada) return res.status(500).send({mensaje: 'Error al Editar Categoria'});
                    return res.status(200).send({categoriaActualizada});

                })
            }
        })            
    }else{
        return res.status(500).send({mensaje: 'No tiene los Permisos Necesarios'});
    }
}

function eliminarCategoria(req, res) {
    var idCategoria = req.params.idCategoria;
    if (req.user.rol === "ROL_ADMIN") {
        var categoriaDefault = new Categoria();
        categoriaDefault.nombre = "Default";
        categoriaDefault.descripcion = "Categoria Default";

        Categoria.find({ $or:[
            {nombre: categoriaDefault.nombre},
            {descripcion: categoriaDefault.descripcion}
        ]}).exec((err, categoriaEncontrada)=>{

            if (err) return res.status(500).send({mensaje: 'Error en la peticion de la Categoría'});

            if (categoriaEncontrada && categoriaEncontrada.length >=1){ 
                Categoria.findById(idCategoria, (err, comprobarDefault) =>{
                    if (err) return res.status(500).send({mensaje: 'Error en la peticion de la Categoria'});
                    if (!comprobarDefault) return res.status(500).send({mensaje: 'Error al Buscar Categoria'});
                    if (comprobarDefault.nombre === "Default") return res.status(500).send({mensaje: 'No puede Eliminar la Categoria Default'});
                    
                    Categoria.findByIdAndRemove(idCategoria, {useFindAndModify: false},(err, categoriaEliminada)=>{
                        if (err) return res.status(500).send({mensaje: 'Error en la peticion de la Categoria'});
                        if (!categoriaEliminada) return res.status(500).send({mensaje: 'Error al Eliminar Categoría'});
                        
                        Categoria.findOne({nombre: "Default", descripcion: "Categoria Default"}, (err, categoriaEncontrada0)=>{
                            if (err) return res.status(500).send({mensaje: 'Error en la peticion de la Categoria'});
                            if (!categoriaEncontrada0) return res.status(500).send({mensaje: 'Error al Buscar Categoria'});
                        
                            Producto.updateMany({categoria: idCategoria}, {$set:{categoria: categoriaEncontrada0._id}}, {new: true, useFindAndModify: false}, (err, productoActualizado)=>{
                                if (err) return res.status(500).send({mensaje: 'Error en la peticion del Producto'});
                                if (!productoActualizado) return res.status(500).send({mensaje: 'Error al Editar Producto'});
                                return res.status(200).send({mensaje: 'Categoria Eliminada',categoriaEliminada});
                            })
                        })
                    })
                })
                

            }else{
                Categoria.findById(idCategoria, (err, comprobarDefault) =>{
                    if (err) return res.status(500).send({mensaje: 'Error en la peticion de la Categoria'});
                    if (!comprobarDefault) return res.status(500).send({mensaje: 'Error al Buscar Categoria'});
                    if (comprobarDefault.nombre === "Default") return res.status(500).send({mensaje: 'No puede Eliminar la Categoria Default'});
                    
                    Categoria.findByIdAndRemove(idCategoria, {useFindAndModify: false}, (err, categoriaEliminada)=>{
                        if (err) return res.status(500).send({mensaje: 'Error en la peticion de la Categoria'});
                        if (!categoriaEliminada) return res.status(500).send({mensaje: 'Error al Eliminar Categoría'});
                        
                        categoriaDefault.save((err, categoriaGuardada) =>{
                            if (err) return res.status(500).send({mensaje: 'Error en la peticion de la Categoria Default'});
                            if (!categoriaGuardada) return res.status(500).send({mensaje: 'Error al Guardar Categoría Default'});
                            
                            Producto.updateMany({categoria: idCategoria}, {$set:{categoria: categoriaGuardada._id}}, {new: true, useFindAndModify: false}, (err, productoActualizado)=>{
                                if (err) return res.status(500).send({mensaje: 'Error en la peticion del Producto'});
                                if (!productoActualizado) return res.status(500).send({mensaje: 'Error al Editar Producto'});
                                return res.status(200).send({mensaje: 'Categoria Eliminada',categoriaEliminada});
                            })
                        })
                    })
                })
            }
        })
    }else{
        return res.status(500).send({mensaje: 'No tiene los Permisos Necesarios'});
    }
}



module.exports = {
    agregarCategoria,
    obtenerCategorias,
    editarCategoria,
    eliminarCategoria
}