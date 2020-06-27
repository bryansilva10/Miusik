/*EXPRESS SERVER */

let express = require('express'); //import express
let bodyParser = require('body-parser'); //import bodyparser

let app = express(); //express app

//config routes
const UserRoutes = require('./routes/user'); //User related Routes

app.use(bodyParser.urlencoded({ extended: false })); //parse body with urlenconded
app.use(bodyParser.json()); //parse body to json

//middlware to funnel all requests
app.use('/api', UserRoutes);

//config headers

//config base routes

//export express app
module.exports = app;