/*MIDDLEWARE FOR AUTHENTICATION RELATED OPERATIONS */

const jwt = require('jwt-simple');//import jwt simple
const moment = require('moment');//import moment for dates
const secret = 'secret_password_miusik'; //used for hash

//Method to make sure request is authenticated
exports.ensureAuth = (req, res, next) => {
	//check if auth header is not set
	if (!req.headers.authorization) {
		//return response with error
		return res.status(403).send({ message: 'Request has no Authorization header' });
	}

	//if the header was set
	//retrieve and store token
	const token = req.headers.authorization.replace(/['"]+/g, '');

	//try to decode token
	try {
		//decode token and store
		const payload = jwt.decode(token, secret);

		//if the data contains an exp date before current data...
		if (payload.exp <= moment().unix()) {
			//return response with message of expiration
			return res.status(401).send({ message: 'Token has expired' });
		}

	} catch (err) {
		console.log(err);
		return res.status(404).send({ message: 'Token is not valid' });
	}

	//add a user property with all the decoded data to every request that uses this middlware
	req.user = payload;

	//exit middleware
	next();
}