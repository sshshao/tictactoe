const http = require('http');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

global.appRoot = path.resolve(__dirname);

var router = express.Router();
var player = require('./routes/player');
var game = require('./routes/game');

var app = express();
console.log("Server running at http://127.0.0.1:8080/");

app.use(bodyParser.urlencoded({ extended: true }));;
app.use(bodyParser.json());

//serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});


http.createServer(app).listen(8080);


router.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/index.html'));
});
router.post('/', function(req, res) {
	var name = req.body.name;
	var d = new Date();
	var page = fs.readFileSync(path.join(__dirname + '/public/game.html'), 'utf8');
	page = page.replace('$name', name);
	page = page.replace('$date', d);
	fs.writeFileSync(path.join(__dirname + '/public/temp.html'), page, 'utf8');

	res.sendFile(path.join(__dirname + '/public/temp.html'));
});
router.post('/play', game.nextMove);

app.use('/ttt', router);
app.listen(3000);