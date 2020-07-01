/*ARTIST RELATED ROUTES */

const express = require('express'); //require express
const ArtistController = require('../controllers/artist'); //require artist controller

//create router
const api = express.Router();

//import auth middlware
const auth = require('../middlewares/auth');

//GET route for retrieving artists
api.get('/artist/:id', auth.ensureAuth, ArtistController.getArtist);

//POST route for saving a new artist
api.post('/artist', auth.ensureAuth, ArtistController.saveArtist);

//exports all routes
module.exports = api;