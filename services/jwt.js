/*UTILITY SERVICE FOR JWT */

const jwt = require('jwt-simple');//import jwt simple
const moment = require('moment');//import moment for dates
const secret = 'secret_password_miusik'; //used for hash

//export method to crete token
exports.createToken = user => {
	//create data for token
	const payload = {
		sub: user._id,
		name: user.name,
		lastname: user.lastname,
		email: user.email,
		role: user.role,
		image: user.image,
		//issued at => create timestamp
		iat: moment().unix(),
		//expires at => create timestamp
		exp: moment().add(30, 'days').unix()
	}

	//return the token
	return jwt.encode(payload, secret)
}