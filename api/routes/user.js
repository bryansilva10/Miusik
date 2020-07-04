/*USER RELATED ROUTES */

const express = require('express');
const UserController = require('../controllers/user');

//import auth middlware
const auth = require('../middlewares/auth');

//for file upload 
const multipart = require('connect-multiparty');
//upload middlware
const md_upload = multipart({ uploadDir: './uploads/users' });

//router
const api = express.Router();

//route to register users
api.post('/register', UserController.saveUser);

//route for login users
api.post('/login', UserController.loginUser);

//route for updating a user
api.put('/update-user/:id', auth.ensureAuth, UserController.updateUser);

//route for uploading image
api.post('/upload-image-user/:id', [auth.ensureAuth, md_upload], UserController.uploadImage);

//route for getting files with correct path
api.get('/get-image-user/:imageFile', UserController.getImageFile);

//export routes
module.exports = api;