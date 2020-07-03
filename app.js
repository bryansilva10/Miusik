/*EXPRESS SERVER */

let express = require('express'); //import express
let bodyParser = require('body-parser'); //import bodyparser

let app = express(); //express app

//config routes
const UserRoutes = require('./routes/user'); //User related Routes
const ArtistRoutes = require('./routes/artist'); //Artist related routes
const AlbumRoutes = require('./routes/album'); //Album related routes

app.use(bodyParser.urlencoded({ extended: false })); //parse body with urlenconded
app.use(bodyParser.json()); //parse body to json

//middlware to funnel all requests
app.use('/api', UserRoutes);
app.use('/api', ArtistRoutes);
app.use('/api', AlbumRoutes);

//config headers

//config base routes

//export express app
module.exports = app;