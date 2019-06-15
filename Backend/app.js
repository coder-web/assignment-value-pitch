const express = require('express');

const app = express();

const mongoose = require('mongoose');

//imporitng app configuration
const appConfig = require('./config/appConfig')
const bodyParser = require('body-parser');
const fs = require('fs');
const routeLoggerMiddleware = require('./app/middlewares/routeLogger.js');


const modelsPath = './app/models';
const routerPath = './app/routes';


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(routeLoggerMiddleware.logIp);

//Bootstrap models
fs.readdirSync(modelsPath).forEach(function(file) {
    if (~file.indexOf('.js')) require(modelsPath + '/' + file)
});
// end Bootstrap models

//Bootstrap routes
fs.readdirSync(routerPath).forEach(function(file) {
    if (~file.indexOf('.js')){
        let route = require(routerPath + '/' + file);
        console.log(route)
        route.setRouter(app);
    }
});



//app start listen
app.listen(appConfig.port)
    .on('error', (err) => {
        if (err.code === 'EADDRINUSE')
            console.log('port is already in use, try another port')
        else console.log(err)
    })
    .on('listening', () => {
        mongoose.connect(appConfig.db.uri, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false })
    });



/*
    * Handling mongoose connection
*/

mongoose.connection.on('error', () => {
    console.log('some error occurred');
});
mongoose.connection.on('open', (err) => {
    if (err) console.log(err + ' some error occurred');
    else {
        console.log("database connection open success");
    }
});