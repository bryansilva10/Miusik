/*ALBUM RELATED ROUTES */

const express = require('express'); //require express
const AlbumController = require('../controllers/album'); //require artist controller

//create router
const api = express.Router();

//import auth middlware
const auth = require('../middlewares/auth');
//for file upload 
const multipart = require('connect-multiparty');
//upload middlware
const md_upload = multipart({ uploadDir: './uploads/albums' });

//GET route for retrieving a specific album
api.get('/album', auth.ensureAuth, AlbumController.getAlbum);

//POST route to save/add an album
api.post('/album', auth.ensureAuth, AlbumController.saveAlbum);

//GET route to retrieve albums from specific artist
api.get('/albums/:artist?', auth.ensureAuth, AlbumController.getAlbums);

//PUT route to update an album
api.put('/album/:id', auth.ensureAuth, AlbumController.updateAlbum);

//DELETE route to update an album
api.delete('/album/:id', auth.ensureAuth, AlbumController.deleteAlbum);

//POST route for uploadig image
api.post('/upload-image-album/:id', [auth.ensureAuth, md_upload], AlbumController.uploadImage);

//GET route for getting artist image
api.get('/get-image-album/:imageFile', AlbumController.getImageFile);


//exports all routes
module.exports = api;