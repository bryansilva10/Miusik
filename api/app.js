/*EXPRESS SERVER */

let express = require('express'); //import express
let bodyParser = require('body-parser'); //import bodyparser

let app = express(); //express app

//config routes
const UserRoutes = require('./routes/user'); //User related Routes
const ArtistRoutes = require('./routes/artist'); //Artist related routes
const AlbumRoutes = require('./routes/album'); //Album related routes
const SongRoutes = require('./routes/song'); //Album related routes

app.use(bodyParser.urlencoded({ extended: false })); //parse body with urlenconded
app.use(bodyParser.json()); //parse body to json

//config CORS headers
app.use((req, res, next) => {
	//Set header to allow access to any domain
	res.setHeader("Access-Control-Allow-Origin", "*");
	//set headers to be alloweed
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, Authorization, X-API-KEY, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
	);
	//set http methods to be allowed
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PATCH, PUT, DELETE, OPTIONS"
	);
	res.setHeader('Allow', "GET, POST, PATCH, PUT, DELETE, OPTIONS");

	//continue to nex middlware
	next();
})

//middlware to funnel all requests to the base routes
app.use('/api', UserRoutes);
app.use('/api', ArtistRoutes);
app.use('/api', AlbumRoutes);
app.use('/api', SongRoutes);

//export express app
module.exports = app;