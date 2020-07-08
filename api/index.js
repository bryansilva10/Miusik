/*ENTRY POINT FOR REST API */

//require mongoose
const mongoose = require('mongoose');
//require express server app
const app = require('./app');
//port for deplyment and local
const port = process.env.PORT || 3977;


//connect to database
mongoose.connect('mongodb+srv://admin-bryan:bryanpass@cluster0-mnqtb.mongodb.net/miusik?retryWrites=true&w=majority', { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false }, (err, res) => {
	//if there is an error
	if (err) {
		throw err;
	} else {
		console.log('Database connected succcesfully');
		//make express server listen to requests
		app.listen(port, () => {
			console.log('Listening on Port: ' + port);
		})
	}
})