/*CONTROLLER FOR ARTIST RELATED OPERATIONS */

//import path and file system
const path = require('path');
const fs = require('fs');

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
			if (!artistStored) {
				//send error message response
				res.status(404).send({ message: 'Could not save artist' });
			} else {
				//send success message response with artist
				res.status(200).send({ artist: storedArtist });
			}
		}
	})
}