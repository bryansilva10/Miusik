/*SONG RELATED ROUTES */

const express = require('express'); //require express
const SongController = require('../controllers/song'); //require artist controller

//create router
const api = express.Router();

//import auth middlware
const auth = require('../middlewares/auth');
//for file upload 
const multipart = require('connect-multiparty');
//upload middlware
const md_upload = multipart({ uploadDir: './uploads/songs' });

//GET route for retrieving a specifics song
api.get('/song/:id', auth.ensureAuth, SongController.getSong);

//POST route for creating/savivng a song
api.post('/song', auth.ensureAuth, SongController.saveSong);

//GET route for retrieving all songs
api.get('/songs/:album?', auth.ensureAuth, SongController.getSongs);

//PUT route for updating a song
api.put('/song/:id', auth.ensureAuth, SongController.updateSong);

//DELETE route for updating a song
api.delete('/song/:id', auth.ensureAuth, SongController.deleteSong);

//POST route for uploadig song
api.post('/upload-file-song/:id', [auth.ensureAuth, md_upload], SongController.uploadFile);

//GET route for getting song file
api.get('/get-song-file/:songFile', SongController.getSongFile);

//exports all routes
module.exports = api;