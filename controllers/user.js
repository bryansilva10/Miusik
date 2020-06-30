/*CONTROLLER FOR USER RELATED OPERATIONS */

//for encrypting passowrd
const bcrypt = require('bcrypt-nodejs');
//import user model
const User = require('../models/user');
//import jwt service file
const jwt = require('../services/jwt');
//import file system and path
const fs = require('fs');
const path = require('path');

//EXPORT FUNCTION TO SIGN UP USER TO DATABASE	
exports.saveUser = (req, res, next) => {
	//extract info from request
	const name = req.body.name;
	const lastname = req.body.lastname;
	const email = req.body.email;
	const role = 'ROLE_ADMIN';
	const image = 'null';

	//check if password exists
	if (req.body.password) {
		//encrypt password...
		bcrypt.hash(req.body.password, null, null, (err, hash) => {
			//if user data is valid...
			if (name != null && lastname != null && email != null) {
				//instantiate a user and add hashed password
				const user = new User({
					name: name,
					lastname: lastname,
					email: email,
					password: hash,
					role: role,
					image: image,
				});
				//save user to database
				user.save((err, storedUser) => {
					//if there was an error saving user to db...
					if (err) {
						//response with error
						res.status(500).json({ message: 'Failed saving user' });
					} else {
						//if another error besides saving
						if (!storedUser) {
							//response with error
							res.status(404).json({ message: 'Error registering user' });
						} else {
							//if no error at all
							//rsponse with sucess and user data
							res.status(200).send({ user: storedUser });
						}
					}
				});
			} else {
				//response with error
				res.status(200).json({ message: 'Please enter all fields' });
			}
		});
	} else {
		//response with error
		res.status(200).json({ message: 'Password missing' });
	}
}

//EXPORT METHOD TO LOGIN USER
exports.loginUser = (req, res, next) => {
	//extract info from request
	const email = req.body.email;
	const password = req.body.password;

	//retrieve a user by email
	User.findOne({ email: email.toLowerCase() }, (err, user) => {
		//if there is an error
		if (err) {
			res.status(500).send({ message: 'Error finding user' });
		} else {
			//if user does NOT exist
			if (!user) {
				res.status(404).send({ message: 'User does not exist' });
			} else {
				//check password
				bcrypt.compare(password, user.password, (err, check) => {
					//if check is successful
					if (check) {
						//check if there is a parameter called gethash
						if (req.body.gethash) {
							//return a jtw token
							res.status(200).send({
								token: jwt.createToken(user)
							})
						} else {
							//respnse with user
							res.status(200).send({ user });
						}
					} else {
						//send error
						res.status(404).send({ message: 'User could not login' });
					}
				});
			}
		}
	})
}

//method to update a user in database
exports.updateUser = (req, res, next) => {
	//retrieve user id from req
	const userId = req.params.id;
	//retrieve modified body
	const update = req.body;

	//use model to find user by id and update entire user
	User.findByIdAndUpdate(userId, update, (err, updatedUser) => {
		//if there was an error updating...
		if (err) {
			//return error rsponse
			res.status(500).send({ message: 'Error updating user' });
		} else {
			//if thre is an error with the returned user
			if (!updatedUser) {
				//return error response
				res.status(404).send({ message: 'Could not update user' });
			} else {
				//return sucessful response and updated user
				res.status(200).send({ user: updatedUser });
			}
		}
	});
}

//method to uplaod user image
exports.uploadImage = (req, res, next) => {
	//retrieve user id from params
	const userId = req.params.id;
	//default file name
	let file_name = 'Not uploaded...';

	//check if there is a file coming in the requst
	if (req.files) {
		//retrieve file path from req
		const file_path = req.files.image.path;
		//split file path
		const file_split = file_path.split('\\');
		//get only name from split file name
		const file_name = file_split[2];

		//split on dot and get file extension
		const ext_split = name.split('\.');
		const file_ext = ext_split[1];

		//check if file has correct extension
		if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
			//update image on database using model
			User.findByIdAndUpdate(userId, { image: file_name }, (err, updatedUser) => {
				//if thre is an error with the returned user
				if (!updatedUser) {
					//return error response
					res.status(404).send({ message: 'Could not update user' });
				} else {
					//return sucessful response and updated user
					res.status(200).send({ user: updatedUser });
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
	const file_path = `./uploads/users/${imageFile}`;

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