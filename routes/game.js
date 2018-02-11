var path = require('path');

exports.nextMove = function(req, res) {
	var grid;

	if(req.body.grid) {
		grid = req.body.grid;
		for(var i = 0; i < 9; i++) {
			if(grid[i] == ' ') {
				grid[i] = 'O';
				break;
			}
		}
		var winner = checkWinner(grid);

		//winner: ' '=none, 'X'=player, 'O'=computer
		res.send({
			'code': 200,
			'grid': grid,
			'winner': winner
		});
	}
}

function checkWinner(grid) {
	for(var i = 0; i < 7; i++) {
		if(i == 0) {
			if((grid[i] == grid[i+1] && grid[i+1] == grid[i+2])
				|| (grid[i] == grid[i+3] && grid[i+3] == grid[i+6])
				|| (grid[i] == grid[i+4] && grid[i+4] == grid[i+8])) {
				if(grid[i] == 'X') {
					return 'X';
				}
				if(grid[i] == 'O') {
					return 'O';
				}
			}
		}

		if(i == 1) {
			if(grid[i] == grid[i+3] && grid[i+3] == grid[i+6]) {
				if(grid[i] == 'X') {
					return 'X';
				}
				if(grid[i] == 'O') {
					return 'O';
				}
			}
		}

		if(i == 2) {
			if((grid[i] == grid[i+2] && grid[i+2] == grid[i+4])
				|| (grid[i] == grid[i+3] && grid[i+3] == grid[i+6])) {
				if(grid[i] == 'X') {
					return 'X';
				}
				if(grid[i] == 'O') {
					return 'O';
				}
			}
		}

		if(i == 3) {
			if(grid[i] == grid[i+1] && grid[i+1] == grid[i+2]) {
				if(grid[i] == 'X') {
					return 'X';
				}
				if(grid[i] == 'O') {
					return 'O';
				}
			}
		}

		if(i == 6) {
			if(grid[i] == grid[i+1] && grid[i+1] == grid[i+2]) {
				if(grid[i] == 'X') {
					return 'X';
				}
				if(grid[i] == 'O') {
					return 'O';
				}
			}
		}
	}

	return ' ';
}