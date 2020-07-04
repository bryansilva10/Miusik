/*SONG MODEL */

const mongoose = require('mongoose'); //import mongoose
const Schema = mongoose.Schema; //schema object

const SongSchema = Schema({
	number: String,
	name: String,
	duration: String,
	file: String,
	album: {
		type: Schema.Types.ObjectId,
		ref: 'Album'
	}
})

//export model using song schema
module.exports = mongoose.model('Song', SongSchema);