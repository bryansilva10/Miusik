/*ARTIST RELATED ROUTES */

const express = require('express'); //require express
const ArtistController = require('../controllers/artist'); //require artist controller

//create router
const api = express.Router();

//import auth middlware
const auth = require('../middlewares/auth');
//for file upload 
const multipart = require('connect-multiparty');
//upload middlware
const md_upload = multipart({ uploadDir: './uploads/artist' });

//GET route for retrieving a specific artist
api.get('/artist/:id', auth.ensureAuth, ArtistController.getArtist);

//POST route for saving a new artist
api.post('/artist', auth.ensureAuth, ArtistController.saveArtist);

//GET route for retrieving all artists with optional pagination
api.get('/artist/:page?', auth.ensureAuth, ArtistController.getArtists);

//PUT route to update an existing Artist
api.put('/artist/:id', auth.ensureAuth, ArtistController.updateArtist);

//DELETE route for removing an artist
api.delete('/artist/:id', auth.ensureAuth, ArtistController.deleteArtist);

//POST route for uploadig image
api.post('/upload-image-artist/:id', [auth.ensureAuth, md_upload], ArtistController.uploadImage);

//GET route for getting artist image
api.get('/get-image-artist/:imageFile', ArtistController.uploadImage);

//exports all routes
module.exports = api;