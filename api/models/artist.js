/*ARTIST MODEL */

const mongoose = require('mongoose'); //import mongoose
const Schema = mongoose.Schema; //schema object

const ArtistSchema = Schema({
	name: String,
	description: String,
	image: String
})

//export model using artist schema
module.exports = mongoose.model('Artist', ArtistSchema);