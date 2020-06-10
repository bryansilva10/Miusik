/*ENTRY POINT FOR REST API */

//require mongoose
const mongoose = require('mongoose');

//connect to database
mongoose.connect('mongodb+srv://admin-bryan:bryanpass@cluster0-mnqtb.mongodb.net/miusik?retryWrites=true&w=majority', { useUnifiedTopology: true, useNewUrlParser: true }, (err, res) => {
	//if there is an error
	if (err) {
		throw err;
	} else {
		console.log('Database connected succcesfully');
	}
})