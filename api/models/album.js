/*ALBUM MODEL */

const mongoose = require('mongoose'); //import mongoose
const Schema = mongoose.Schema; //schema object

const AlbumSchema = Schema({
	title: String,
	description: String,
	year: Number,
	image: String,
	artist: {
		type: Schema.Types.ObjectId,
		ref: 'Artist'
	}
})

//export model using artist schema
module.exports = mongoose.model('Album', AlbumSchema);