// set up ========================
    var express  = require('express');
    var app      = express();                               // crea la applicacion
    var mongoose = require('mongoose');                     // mongoose para mongodb
    var morgan = require('morgan');             // log requests para la consola (express4)
    var bodyParser = require('body-parser');    // HTML POST (express4)
    var methodOverride = require('method-override'); // simula DELETE y PUT (express4)


    // configuration =================

    //mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');     // conecta con la base de datos usando modulus.io

    app.use(express.static(__dirname + '/public'));                 // establece localización estatica de los archivos /public/img será /img para los usuarios
    app.use(morgan('dev'));                                         // imprime cada request en la consola
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parsea application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parsea application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parsea application/vnd.api+json as json
    app.use(methodOverride());



    // Rutas
    //      BASE DE DATOS


    // application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html');
    });


    // Abriendo puerto (inicializar app con node server.js) ======================================
    app.listen(80);
    console.log("Escuchando en el puerto 80");