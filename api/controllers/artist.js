/*CONTROLLER FOR ARTIST RELATED OPERATIONS */

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
exports.getArtist = (req, res, next) => {
	//retrieve artist id from param
	const artistId = req.params.id;

	//find artist by id
	Artist.findById(artistId, (err, artist) => {
		//if we have an error
		if (err) {
			//send error respoonse
			res.status(500).send({ message: 'Error trying to find artist' });
		} else {
			//check if artist is not defined
			if (!artist) {
				//send error respoonse
				res.status(404).send({ message: 'Artist was not found' });
			} else {
				//send success respoonse and artist
				res.status(200).send({ artist: artist });
			}
		}
	})
}

//method to get all artists
exports.getArtists = (req, res, next) => {
	//if there is a page parameter...
	if (req.params.page) {
		//retrieve and assign page from params
		var page = req.params.page;
	} else {
		//default to 1
		var page = 1;
	}

	//how many artists per page
	const itemsPerPage = 3;

	//find all Artists
	Artist.find()
		//sort by name
		.sort('name')
		//paginate, pass current page and items per page, and cb function with err, artist objects and total pages
		.paginate(page, itemsPerPage, (err, artists, total) => {
			//if there is an error 
			if (err) {
				//send err response
				res.status(500).send({ message: 'Error on the request' });
			} else {
				//if there were no artists
				if (!artists) {
					//not found response
					res.status(404).send({ message: 'No artists on list' });
				} else {
					//return success response
					return res.status(200).send({
						//num of pages
						total_items: total,
						artists: artists
					})
				}
			}
		})
}

//method to save an artist
exports.saveArtist = (req, res, next) => {
	//retrieve info from request
	const name = req.body.name;
	const description = req.body.description;
	const image = 'null';

	//create new artist
	const artist = new Artist({
		name: name,
		description: description,
		image: image
	});

	//save artist to db
	artist.save((err, storedArtist) => {
		//if there is an error
		if (err) {
			//send error message response
			res.status(500).send({ message: 'Error saving Artist' });
		} else {
			//if we don't get stored artist...
			if (!storedArtist) {
				//send error message response
				res.status(404).send({ message: 'Could not save artist' });
			} else {
				//send success message response with artist
				res.status(200).send({ artist: storedArtist });
			}
		}
	})
}

//method to update an artist info
exports.updateArtist = (req, res, next) => {
	//retrieve artist id
	const artistId = req.params.id;

	//updated artist info coming from req body
	const update = req.body;

	//find by id and update in db
	Artist.findByIdAndUpdate(artistId, update, (err, updatedArtist) => {
		//if there is an error...
		if (err) {
			//send error message response
			res.status(500).send({ message: 'Error in the request to find an Artist' });
		} else {
			//check if artist is not defined
			if (!updatedArtist) {
				//send error message response
				res.status(404).send({ message: 'Could not update artist' });
			} else {
				//send success message response with artist
				res.status(200).send({ artist: updatedArtist });
			}
		}
	})
}

//method to delete artit and associated songs and albums
exports.deleteArtist = (req, res, next) => {
	//retrieve id from params
	const artistId = req.params.id;

	//find artist by id and remove
	Artist.findByIdAndRemove(artistId, (err, removedArtist) => {
		//if there is an error...
		if (err) {
			//send error message response
			res.status(500).send({ message: 'Error in the request to find an Artist' });
		} else {
			//check if artist is found and removed
			if (!removedArtist) {
				//send 404 response
				res.status(404).send({ message: 'Could not find and delete artist' });
			} else {
				//find albums that belong to the artist that was removed (by id)
				Album.find({ artist: removedArtist._id })
					//remove the found album
					.remove((err, removedAlbum) => {
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
												res.status(200).send({ artist: removedArtist })
											}
										}
									});
							}
						}
					});
			}
		}
	})
}

//method to uplaod user image
exports.uploadImage = (req, res, next) => {
	//retrieve user id from params
	const artistId = req.params.id;
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
		const ext_split = file_name.split('\.');
		const file_ext = ext_split[1];

		//check if file has correct extension
		if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
			//update image on database using model
			Artist.findByIdAndUpdate(artistId, { image: file_name }, (err, updatedArtist) => {
				//if thre is an error with the returned user
				if (!updatedArtist) {
					//return error response
					res.status(404).send({ message: 'Could not update Artist' });
				} else {
					//return sucessful response and updated user
					res.status(200).send({ artist: updatedArtist });
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
	const file_path = `./uploads/artists/${imageFile}`;

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