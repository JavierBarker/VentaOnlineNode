'use strict'
const mongoose = require("mongoose");
const app = require("./app");

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/VentaOnline', {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log('Se establecio la Conexion a la Base de Datos');
    app.listen(3000, function(){
        console.log('El Servidor esta corriendo en el Puerto: 3000');
    })
}).catch(err => console.log(err))