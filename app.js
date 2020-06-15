/*EXPRESS SERVER */

let express = require('express'); //import express
let bodyParser = require('body-parser'); //import bodyparser

let app = express(); //express app

app.use(bodyParser.urlencoded({ extended: false })); //parse body with urlenconded
app.use(bodyParser.json()); //parse body to json

//config headers

//config base routes

app.get('/tests', (req, res, next) => {
	res.status(200).send({ message: 'Working' })
})

module.exports = app;