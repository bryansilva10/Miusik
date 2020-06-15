/*USER MODEL */

const mongoose = require('mongoose'); //import mongoose
const Schema = mongoose.Schema; //schema object

//define schema for user
const UserSchema = Schema({
	name: String,
	lastname: String,
	email: String,
	password: String,
	role: String,
	image: String
});

//export model using user schema
module.exports = mongoose.model('User', UserSchema);