var http = require('http');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

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
router.post('/', player.showPlayer);

app.use('/ttt', router);
app.listen(5000);