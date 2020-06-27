/*USER RELATED ROUTES */

const express = require('express');
const UserController = require('../controllers/user');

//import auth middlware
const auth = require('../middlewares/auth');

//router
const api = express.Router();

//route to register users
api.post('/register', UserController.saveUser);
//route for login users
api.post('/login', UserController.loginUser);
//route for updating a user
api.put('/update-user/:id', auth.ensureAuth, UserController.updateUser);

//export routes
module.exports = api;