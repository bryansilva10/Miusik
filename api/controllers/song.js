/*CONTROLLER FOR SONG RELATED OPERATIONS */

//import path and file system
const path = require('path');
const fs = require('fs');
//module for pagination
const mongoosePaginate = require('mongoose-pagination');

//import models
const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');
const { find } = require('../models/artist');

//method to get songs
exports.getSong = (req, res, next) => {
	//retrieve song id from url
	const songId = req.params.id;

	//find song by id
	Song.findById(songId)
		//populate album
		.populate({ path: 'album' })
		//execute query
		.exec((err, song) => {
			//if there is an error on request
			if (err) {
				//500 error
				res.status(500).send({ message: 'Error on the request to find Song' });
			} else {
				//check if song is not defined
				if (!song) {
					//404 error
					res.status(404).send({ message: 'Could not find Song' });
				} else {
					//success error
					res.status(200).send({ song })
				}
			}
		})
}

//method to get all songs
exports.getSongs = (req, res, next) => {
	//retrieve album id
	const albumId = req.params.album;

	//check if no album id was passed
	if (!albumId) {
		//response with all songs
		//find all songs and sort by song numbr
		var find = Song.find({}).sort('number');
	} else {
		//response wth album specific songs
		//find song by album id and sort by number
		var find = Song.find({ album: albumId }).sort('number');
	}

	//populate the album
	find.populate({
		path: 'album',
		//populate the artist of the album
		populate: {
			path: 'artist',
			model: 'Artist'
		}
	})
		//execute query
		.exec((err, songs) => {
			//if there is an error
			if (err) {
				//500 error
				res.status(500).send({ message: 'Error on the request to find Songs' });
			} else {
				//check if songs are not defined
				if (!songs) {
					//404 error
					res.status(404).send({ message: 'Could not find Songs' });
				} else {
					//success response
					res.status(200).send({ songs })
				}
			}
		})
}

//method to save songs in albums
exports.saveSong = (req, res, next) => {
	//get song info from req body
	const number = req.body.number;
	const name = req.body.name;
	const duration = req.body.duration;
	const file = null;
	const album = req.body.album;

	//create a song
	const song = new Song({
		number,
		name,
		duration,
		file,
		album
	});

	//save song to db
	song.save((err, storedSong) => {
		//check if there is an error on request
		if (err) {
			//500 error
			res.status(500).send({ message: 'Error on the request to store Song' });
		} else {
			//check if stored song is not defined or stored
			if (!storedSong) {
				//404 error
				res.status(404).send({ message: 'Song could not be stored' });
			} else {
				//success message with song object
				res.status(200).send({ song: storedSong });
			}
		}
	})
}

//method to update song
exports.updateSong = (req, res, next) => {
	//retrieve song id from url
	var songId = req.params.id;

	//store modifications
	var update = req.body;

	Song.findByIdAndUpdate(songId, update, (err, updatedSong) => {
		//check if there is an error on request
		if (err) {
			//500 error
			res.status(500).send({ message: 'Error on the request to update Song' });
		} else {
			//check if stored song is not defined or stored
			if (!updatedSong) {
				//404 error
				res.status(404).send({ message: 'Song could not be updated' });
			} else {
				//success message with updated song object
				res.status(200).send({ song: updatedSong });
			}
		}
	})
}

//method to delete a song
exports.deleteSong = (req, res) => {
	//retrieve song id from url
	const songId = req.params.id;

	//find by id and delete
	Song.findByIdAndRemove(songId, (err, removedSong) => {
		//check if there is an error on request
		if (err) {
			//500 error
			res.status(500).send({ message: 'Error on the request to delete Song' });
		} else {
			//check if stored song is not defined or found
			if (!removedSong) {
				//404 error
				res.status(404).send({ message: 'Song could not be deleted' });
			} else {
				//success message with updated song object
				res.status(200).send({ song: removedSong });
			}
		}
	})
}

//method to uplaod song file
exports.uploadFile = (req, res, next) => {
	//retrieve user id from params
	const songId = req.params.id;
	//default file name
	let file_name = 'Not uploaded...';

	//check if there is a file coming in the requst
	if (req.files) {
		//retrieve file path from req
		const file_path = req.files.file.path;
		//split file path
		const file_split = file_path.split(path.sep);
		//get only name from split file name
		const file_name = file_split[2];

		//split on dot and get file extension
		const ext_split = file_name.split('\.');
		const file_ext = ext_split[1];

		//check if file has correct extension
		if (file_ext == 'mp3') {
			//update image on database using model
			Song.findByIdAndUpdate(songId, { file: file_name }, (err, updatedSong) => {
				//if thre is an error with the returned user
				if (!updatedSong) {
					//return error response
					res.status(404).send({ message: 'Could not update Song' });
				} else {
					//return sucessful response and updated user
					res.status(200).send({ song: updatedSong });
				}
			});
		} else {
			//return error response, wrong file extentsion
			res.status(200).send({ message: 'File Extention is not valid...' });
		}


	} else {
		//return error response
		res.status(200).send({ message: 'No image was uploaded...' });
	}
}

//method to get image files
exports.getSongFile = (req, res, next) => {
	//retrieve image file name from params
	const songFile = req.params.songFile;
	//entire file path
	const file_path = `./uploads/songs/${songFile}`;

	//check if file exists in folder
	//callback to do something with it
	fs.exists(file_path, exists => {
		//if file exists
		if (exists) {
			//send the file
			res.sendFile(path.resolve(file_path));
		} else {
			//return error response
			res.status(200).send({ message: 'Song does not exist...' });
		}
	});
}