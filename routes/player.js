var path = require('path');

exports.showPlayer = function(req, res) {
	var player;
	player = req.body.name;

	res.send({
		"code": 400,
		"name": player
	});
}