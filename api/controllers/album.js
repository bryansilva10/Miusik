/*CONTROLLER FOR ALBUM RELATED OPERATIONS */

//import path and file system
const path = require('path');
const fs = require('fs');
//module for pagination
const mongoosePaginate = require('mongoose-pagination');

//import models
const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');

//method to get artists
exports.getAlbum = (req, res, next) => {
	//retrieve album id from url
	const albumId = req.params.id;

	//find album by id
	Album.findById(albumId)
		//populate the artist field
		.populate({ path: 'artist' })
		//execute the query
		.exec((err, album) => {
			//if there is an error
			if (err) {
				//error response
				res.status(500).send({ message: 'Error on the request' })
			} else {
				//check if album is not defined
				if (!album) {
					//send error response
					res.status(404).send({ message: 'Album does not exist' })
				} else {
					//succesful response with album object
					res.status(200).send({ album });
				}
			}
		})
}

//method to get all albums
exports.getAlbums = (req, res, next) => {
	//retrieve artist id from url
	const artistId = req.params.artist;

	//check if artistId is NOT defined
	if (!artistId) {
		//retrieve ALL albums from db and sort by title
		const find = Album.find({}).sort('title');
	} else {
		//retrieve albums from specific artist from db and sort by year
		const find = Album.find({ artist: artistId }).sort('year');
	}

	//populate found albums with artist info
	find.populate({ path: 'artist' })
		//execute the query
		.exec((err, albums) => {
			//if there is an error
			if (err) {
				//error response
				res.status(500).send({ message: 'Error on the request' });
			} else {
				//if no albums were found...
				if (!albums) {
					//error response
					res.status(404).send({ message: 'Albums not found' })
				} else {
					//successful response with albums
					res.status(200).send({ albums });
				}
			}
		})
}

//method to save an album in db
exports.saveAlbum = (req, res, next) => {
	//get album info from body
	const title = req.body.title;
	const description = req.body.description;
	const year = req.body.year;
	const image = 'null';
	const artist = req.body.artist;

	//create album
	const album = new Album({
		title: title,
		description: description,
		year: year,
		image: image,
		artist: artist
	});

	//save album
	album.save((err, storedAlbum) => {
		//chck if there is error
		if (err) {
			//error response
			res.status(500).send({ message: 'Error on the request to save Album' })
		} else {
			//check if stored album is defiend
			if (!storedAlbum) {
				//error response
				res.status(404).send({ message: 'Album not saved' })
			} else {
				//success response with album object
				res.status(200).send({ album: storedAlbum });
			}
		}
	})
}

//method to update an album
exports.updateAlbum = (req, res, next) => {
	//retrieve album id from url
	const albumId = req.params.id;
	//retrieve modified info for album
	const update = req.body;

	//find album by id and update
	Album.findByIdAndUpdate(albumId, update, (err, updatedAlbum) => {
		//if there is an error in the request
		if (err) {
			//error response
			res.status(500).send({ message: 'Error on the request to update Album' });
		} else {
			//check if album is not found
			if (!updateAlbum) {
				//send 404 error
				res.status(404).send({ message: 'Album not found' });
			} else {
				//send successful response with updated album
				res.status(200).send({ album: updatedAlbum });
			}
		}
	})
}

//method to delete an album
exports.deleteAlbum = (req, res, next) => {
	//retrieve album id in url
	const albumId = req.params.id;

	//find specific album by id
	Album.findByIdAndRemove(albumId, (err, removedAlbum) => {
		if (err) {
			//send error message response
			res.status(500).send({ message: 'Error in the request to remove the Album' });
		} else {
			//check if album is found and removed
			if (!removedAlbum) {
				//send 404 response
				res.status(404).send({ message: 'Could not find and delete album' });
			} else {
				//find songs that belong to the album that was removed (by id)
				Song.find({ album: removedAlbum._id })
					//remove the found song
					.remove((err, removedSong) => {
						if (err) {
							//send error message response
							res.status(500).send({ message: 'Error in the request to remove the Song' });
						} else {
							//check if song is found and removed
							if (!removedSong) {
								//send 404 response
								res.status(404).send({ message: 'Could not find and delete song' });
							} else {
								//successful response
								res.status(200).send({ album: removedAlbum })
							}
						}
					});
			}
		}
	});
}

//method to uplaod user image
exports.uploadImage = (req, res, next) => {
	//retrieve user id from params
	const albumId = req.params.id;
	//default file name
	let file_name = 'Not uploaded...';

	//check if there is a file coming in the requst
	if (req.files) {
		//retrieve file path from req
		const file_path = req.files.image.path;
		//split file path
		const file_split = file_path.split(path.sep);
		//get only name from split file name
		const file_name = file_split[2];

		//split on dot and get file extension
		const ext_split = name.split('\.');
		const file_ext = ext_split[1];

		//check if file has correct extension
		if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
			//update image on database using model
			Album.findByIdAndUpdate(albumId, { image: file_name }, (err, updatedAlbum) => {
				//if thre is an error with the returned user
				if (!updatedAlbum) {
					//return error response
					res.status(404).send({ message: 'Could not update user' });
				} else {
					//return sucessful response and updated user
					res.status(200).send({ album: updatedAlbum });
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
exports.getImageFile = (req, res, next) => {
	//retrieve image file name from params
	const imageFile = req.params.imageFile;
	//entire file path
	const file_path = `./uploads/albums/${imageFile}`;

	//check if file exists in folder
	//callback to do something with it
	fs.exists(file_path, exists => {
		//if file exists
		if (exists) {
			//send the file
			res.sendFile(path.resolve(file_path));
		} else {
			//return error response
			res.status(200).send({ message: 'Image does not exist...' });
		}
	});
}
