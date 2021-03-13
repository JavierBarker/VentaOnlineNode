'use strict'

const Usuario = require("../models/usuario.model");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt.usuario");


const Producto = require("../models/producto.model");


function registrarAdmin(req, res) {
    var usuarioAdmin = new Usuario();
    usuarioAdmin.nombre = "ADMIN";
    usuarioAdmin.usuario = "ADMIN";
    usuarioAdmin.rol = "ROL_ADMIN";
    usuarioAdmin.carritoDeCompras={
        productos: [],
        total: 0
    };

    Usuario.find({$or:[
        {nombre: usuarioAdmin.nombre},
        {usuario: usuarioAdmin.usuario}
    ]}).exec((err, adminEncontrado)=>{
        if(err) return console.log('Error al Buscar ADMIN');
        if(adminEncontrado && adminEncontrado.length >= 1){
            console.log('El ADMIN ya Existe');
        }else{
            bcrypt.hash("123456", null, null, (err, passEncriptada)=>{
                usuarioAdmin.password = passEncriptada;

                usuarioAdmin.save((err, adminGuardado)=>{
                    if(err) return console.log('Error al Guardar ADMIN', err);
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

function login(req, res) {
    var params = req.body;
    if (params.rol === 'ROL_ADMIN' ||  params.rol === 'ROL_CLIENTE') {
        if (params.usuario && params.password && params.rol && params.getToken) {
            Usuario.findOne({usuario: params.usuario}, (err, usuarioEncontrado)=>{
                if (err) return res.status(500).send({mensaje: 'Error en la peticion Login'});
        
                if(usuarioEncontrado){
                    bcrypt.compare(params.password, usuarioEncontrado.password, (err, passCorrecta)=>{
                        if (passCorrecta) {
                            if (params.getToken === 'true') {
                                return res.status(200).send({token: jwt.createToken(usuarioEncontrado)});
                            }else{
                                usuarioEncontrado.password = undefined;
                                return res.status(200).send({usuarioEncontrado});
                            }
                        }else{
                            return res.status(404).send({mensaje: 'El Usuario o Contraseña son Erróneos', err});
                        }
                    })
                }else{
                    return res.status(404).send({mensaje: 'El Usuario no se ha podido ingresar'});
                }
            })
        }else{
            return res.status(500).send({mensaje: 'Rellene los datos necesarios para logearse'});
        }
    }else{
        return res.status(404).send({mensaje: 'Coloque ROL_ADMIN o ROL_CLIENTE en el Rol'});
    }
}


//GESTION DE USUARIOS
function registrarUsuarioConAdmin(req, res) {
    var usuarioModelo = new Usuario();
    var params = req.body;
    if (req.user.rol === 'ROL_ADMIN') {
        if (params.usuario && params.usuario && params.rol && params.password) {
            if (params.rol === 'ROL_ADMIN' ||  params.rol === 'ROL_CLIENTE') {
                usuarioModelo.nombre = params.nombre;
                usuarioModelo.usuario = params.usuario;
                usuarioModelo.rol = params.rol;
                usuarioModelo.carritoDeCompras={
                    productos: [],
                    total: 0
                };
        
                Usuario.find({$or:[
                    {usuario: usuarioModelo.usuario}
                ]}).exec((err, usuarioEncontrado)=>{
                    if (err) return res.status(500).send({mensaje: 'Error en la peticion del Usuario'});
        
                    if (usuarioEncontrado && usuarioEncontrado.length >= 1){
                        return res.status(500).send({mensaje: 'Este Nombre de Usuario ya esta Registrado'});
                    }else{
                        bcrypt.hash(params.password, null, null, (err, passEncriptada)=>{
                            usuarioModelo.password = passEncriptada;
            
                            usuarioModelo.save((err, usuarioGuardado)=>{
                                if(err) return res.status(500).send({mensaje: 'Error en la peticion del Usuario'});
                                if(usuarioGuardado){
                                    return res.status(500).send({usuarioGuardado});
                                }else{
                                    return res.status(500).send({mensaje: 'No se Registro el Usuario'});
                                }
                            })
                        })
                    }
                })
            }else{
                return res.status(404).send({mensaje: 'Coloque ROL_ADMIN o ROL_CLIENTE en el Rol'});
            }
        }else{
            return res.status(500).send({mensaje: 'Rellene los datos necesarios para crear el Usuario'});
        } 
    }else{
        return res.status(500).send({mensaje: 'No tiene los Permisos Necesarios'});
    }    
}

function editarUsuarioConAdmin(req, res) {
    var idUsuario = req.params.idUsuario;
    var params = req.body;
    if (req.user.rol === 'ROL_ADMIN') {
        if (params.rol === 'ROL_ADMIN' || params.rol === 'ROL_CLIENTE') {
            Usuario.find({ $or:[
                {usuario: params.usuario}
            ]}).exec((err, usuarioEncontrado)=>{
                if (err) return res.status(500).send({mensaje: 'Error en la peticion del Usuario'});
                
    
                if (usuarioEncontrado && usuarioEncontrado.length >= 1){
                    return res.status(500).send({mensaje: 'No se puede editar un Usuario con un Nombre de Usuario Igual a otro Usuario'});
                }else{
                    
                    Usuario.findById(idUsuario, (err, comprobarRol)=>{
                        if (err) return res.status(500).send({mensaje: 'Error en la peticion del Usuario'});
                        if (!comprobarRol) return res.status(500).send({mensaje: 'Error al Buscar Usuario'});
                        if (comprobarRol.rol === 'ROL_ADMIN') return res.status(200).send({mensaje: 'No se pueden Editar Admins'});
                        
                        delete params.password;
                        Usuario.findByIdAndUpdate(idUsuario, params, {new: true, useFindAndModify: false}, (err, usuarioActualizado)=>{
                            if (err) return res.status(500).send({mensaje: 'Error en la peticion del Usuario'});
                            if (!usuarioActualizado) return res.status(500).send({mensaje: 'Error al Editar el Usuario'});
                            return res.status(200).send({usuarioActualizado});
                        })
                    })    
                    
                }
            })       
        }else{
            return res.status(404).send({mensaje: 'Coloque ROL_ADMIN o ROL_CLIENTE en el Rol'});
        }
    }else{
        return res.status(500).send({mensaje: 'No tiene los Permisos Necesarios'});
    }
}


function eliminarUsuarioConAdmin(req, res) {
    var idUsuario = req.params.idUsuario;
    if (req.user.rol === 'ROL_ADMIN') {
        Usuario.findById(idUsuario, (err, comprobarRol)=>{
            if (err) return res.status(500).send({mensaje: 'Error en la peticion del Usuario'});
            if (!comprobarRol) return res.status(500).send({mensaje: 'Error al Buscar Usuario'});
            if (comprobarRol.rol === 'ROL_ADMIN') return res.status(200).send({mensaje: 'No se pueden Eliminar Admins'});
            
            Usuario.findByIdAndRemove(idUsuario, {useFindAndModify: false}, (err, usuarioEliminado)=>{
                if (err) return res.status(500).send({mensaje: 'Error en la peticion Usuario'});
                if (!usuarioEliminado) return res.status(500).send({mensaje: 'Error al Eliminar Usuario'});
                return res.status(200).send({mensaje: 'Usuario Eliminado',usuarioEliminado});
            })
        })
    }else{
        return res.status(500).send({mensaje: 'No tiene los Permisos Necesarios'});
    }
}







//FUNCIONES DE LOS CLIENTES

// Podrá tener la opción de iniciar sesión y de registrar. La cual si se 
//registra el rol automáticamente deberá tomarse como cliente.
function registrarCliente(req, res) {
    var params = req.body;
    var usuarioModelo = new Usuario();
    if (params.usuario && params.usuario && params.password) {
        usuarioModelo.nombre = params.nombre;
        usuarioModelo.usuario = params.usuario;
        usuarioModelo.rol = "ROL_CLIENTE";
        usuarioModelo.carritoDeCompras={
            productos: [],
            total: 0
        };
    
        Usuario.find({$or:[
            {usuario: usuarioModelo.usuario}
        ]}).exec((err, usuarioEncontrado)=>{
            if (err) return res.status(500).send({mensaje: 'Error en la peticion del Usuario'});
    
             if (usuarioEncontrado && usuarioEncontrado.length >= 1){
                return res.status(500).send({mensaje: 'Este Nombre de Usuario ya esta Registrado'});
            }else{
                bcrypt.hash(params.password, null, null, (err, passEncriptada)=>{
                    usuarioModelo.password = passEncriptada;
    
                    usuarioModelo.save((err, usuarioGuardado)=>{
                        if(err) return res.status(500).send({mensaje: 'Error en la peticion del Usuario'});
                        if(usuarioGuardado){
                            return res.status(500).send({usuarioGuardado});
                        }else{
                            return res.status(500).send({mensaje: 'No se Registro el Usuario'});
                        }
                    })
                })
            }
        })
    }else{
        return res.status(500).send({mensaje: 'Rellene los datos necesarios para crear el Usuario'});
    }
}


//Ver el catálogo de productos más vendidos.
function productosMasVendidos(req, res) {//Actualice el "cantidadComprada" de los productos para probarlo
    if (req.user.rol === 'ROL_CLIENTE') {
        Producto.aggregate([{$sort:{cantidadComprada: -1}},{$limit: 4}]).exec((err, productosOrdenados)=>{
            if (err) return res.status(500).send({mensaje: 'Error en la peticion del Producto'});
            if (!productosOrdenados) return res.status(500).send({mensaje: 'Error al Buscar Productos'});
            return res.status(200).send({mensaje: 'Estos son los 4 Productos mas Vendidos',productosOrdenados});
        })
    }else{
        return res.status(500).send({mensaje: 'No tiene los Permisos Necesarios'});
    }
}


// Buscar los productos por su nombre.
function buscarProductoPorNombre(req, res) {
    var nombreProducto = req.body.nombre;
    if (req.user.rol === 'ROL_CLIENTE') {
        Producto.aggregate([
    
            {$match: {nombre:{$regex: nombreProducto, $options: 'i'}}},
        
        ]).exec((err, resp) =>{
            
            return res.status(200).send({resp});
        })
    }else{
        return res.status(500).send({mensaje: 'No tiene los Permisos Necesarios'});
    }
}

/// poder ver el catálogo de productospor categoría. (Buscar por categoría)
function productosEnCategoria(req, res) {
    var idCategoria = req.params.idCategoria;
    if (req.user.rol === 'ROL_CLIENTE') {
        Producto.find({categoria: idCategoria}, (err, productosEncontrados)=>{
            if (err) return res.status(500).send({mensaje: 'Error en la peticion del Producto'});
            if (!productosEncontrados) return res.status(500).send({mensaje: 'Error al Buscar Productos'});
            return res.status(200).send({productosEncontrados});
        })
    }else{
        return res.status(500).send({mensaje: 'No tiene los Permisos Necesarios'});
    }
}



//Agregar al carrito de compras.
function agregarAlCarrito(req, res) {
    var idCliente = req.user.sub;
    var idProducto = req.params.idProducto;
    if (req.user.rol === 'ROL_CLIENTE') {
        Producto.findById(idProducto,(err, productoEncontrado)=>{
            if (err) return res.status(500).send({mensaje: 'Error en la peticion del Producto'});
            if (!productoEncontrado) return res.status(500).send({mensaje: 'Error al Buscar Producto'});
            
            Usuario.findOne({_id: idCliente, "carritoDeCompras.productos.idProducto": idProducto}, {"carritoDeCompras.productos.$": 1},(err, productoEncontradoArray)=>{
                if (err) return res.status(500).send({ mensaje: 'Error en la peticion de Usuarios', err});
                //if (!productoEncontradoArray) return res.status(500).send({ mensaje: 'Error al obtener Usuario', productoEncontradoArray});
                if (!productoEncontradoArray) {
                    var subTotalAgregar = parseInt(productoEncontradoArray.subTotal + productoEncontrado.precio);

                    Usuario.findByIdAndUpdate(idCliente, {$push: {"carritoDeCompras.productos": {
                        nombre: productoEncontrado.nombre,
                        cantidad: productoEncontrado.cantidad,
                        precio: productoEncontrado.precio,
                        subTotal: subTotalAgregar,
                        idProducto: productoEncontrado._id
                    }}}, {new: true, useFindAndModify: false}, (err, carritoAgregado)=>{
                        if (err) return res.status(500).send({ mensaje: 'Error en la peticion del Usuario', err});
                        if (!carritoAgregado) return res.status(500).send({ mensaje: 'Error al Agregar Carrito'});
                        return res.status(200).send({carritoAgregado});
                    })
                }else{
                    
                    

                    Usuario.findOneAndUpdate({_id: idCliente, "carritoDeCompras.productos.idProducto": idProducto}, {"carritoDeCompras.$.productos.$.subTotal": subTotalAgregar},
                    {new: true, useFindAndModify: false},(err, carritoAgregado)=>{
                        if (err) return res.status(500).send({ mensaje: 'Error en la peticion del Usuario', err});
                        if (!carritoAgregado) return res.status(500).send({ mensaje: 'Error al Agregar Carrito'});
                        return res.status(500).send({carritoAgregado});
                    })   
                }
            })
        })
    }else{
        return res.status(500).send({mensaje: 'No tiene los Permisos Necesarios'});
    }
}


//Editar su perfil.
function editarCliente(req, res) {
    var params = req.body;
    if (req.user.rol === 'ROL_CLIENTE') {
        Usuario.find({ $or:[
            {usuario: params.usuario}
        ]}).exec((err, usuarioEncontrado)=>{
            if (err) return res.status(500).send({mensaje: 'Error en la peticion del Usuario'});

            if (usuarioEncontrado && usuarioEncontrado.length >= 1){
                return res.status(500).send({mensaje: 'No se puede editar un Usuario con un Nombre de Usuario Igual a otro Usuario'});
            }else{
                params.rol = 'ROL_CLIENTE';
                delete params.password;
                Usuario.findByIdAndUpdate(req.user.sub, params, {new: true, useFindAndModify: false}, (err, usuarioActualizado)=>{
                    if (err) return res.status(500).send({mensaje: 'Error en la peticion del Usuario'});
                    if (!usuarioActualizado) return res.status(500).send({mensaje: 'Error al Editar el Usuario'});
                    return res.status(200).send({usuarioActualizado});
                })
            }
        })
    }else{
        return res.status(500).send({mensaje: 'No tiene los Permisos Necesarios'});
    }
}


//Eliminar su cuenta.
function eliminarCliente(req, res) {
    if (req.user.rol === 'ROL_CLIENTE') {
        Usuario.findByIdAndRemove(req.user.sub, {useFindAndModify: false}, (err, usuarioEliminado)=>{
            if (err) return res.status(500).send({mensaje: 'Error en la peticion Usuario'});
            if (!usuarioEliminado) return res.status(500).send({mensaje: 'Error al Eliminar Usuario'});
            return res.status(200).send({mensaje: 'Usuario Eliminado',usuarioEliminado});
        })
    }else{
        return res.status(500).send({mensaje: 'No tiene los Permisos Necesarios'});
    }
}

module.exports = {
    registrarAdmin,
    login,
    registrarUsuarioConAdmin,
    editarUsuarioConAdmin,
    eliminarUsuarioConAdmin,

    //Funciones del Cliente
    registrarCliente,
    productosMasVendidos,
    buscarProductoPorNombre,
    productosEnCategoria,
    agregarAlCarrito,
    editarCliente,
    eliminarCliente
}