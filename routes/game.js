var path = require('path');

exports.nextMove = function(req, res) {
	var grid;

	if(req.body.grid) {
		grid = req.body.grid;

		//computer move
		var pos;
		do {
			pos = Math.floor(Math.random()*10);
		} while(grid[pos] != ' ');
		grid[pos] = 'O';

		var winner = checkWinner(grid);

		//winner: ' '=none, 'X'=player, 'O'=computer
		if(winner == ' ') {
			res.send({
				'code': 200,
				'grid': grid,
			});
		}
		else {
			res.send({
				'code': 200,
				'grid': grid,
				'winner': winner
			});
		}
	}
}

function checkWinner(grid) {
	var symbol = ['X', 'O'];

	for(var i = 0; i < symbol.length; i++) {
		for(var j = 0; j < 7; j++) {
			if(j == 0) {
				if((grid[j] == grid[j+1] && grid[j+1] == grid[j+2])
					|| (grid[j] == grid[j+3] && grid[j+3] == grid[j+6])
					|| (grid[j] == grid[j+4] && grid[j+4] == grid[j+8])) {
					if(grid[j] == symbol[i]) {
						return symbol[i];
					}
				}
			}
	
			if(j == 1) {
				if(grid[j] == grid[j+3] && grid[j+3] == grid[j+6]) {
					if(grid[j] == symbol[i]) {
						return symbol[i];
					}
				}
			}
	
			if(j == 2) {
				if((grid[j] == grid[j+2] && grid[j+2] == grid[j+4])
					|| (grid[j] == grid[j+3] && grid[j+3] == grid[j+6])) {
					if(grid[j] == symbol[i]) {
						return symbol[i];
					}
				}
			}
	
			if(j == 3) {
				if(grid[j] == grid[j+1] && grid[j+1] == grid[j+2]) {
					if(grid[j] == symbol[i]) {
						return symbol[i];
					}
				}
			}
	
			if(j == 6) {
				if(grid[j] == grid[j+1] && grid[j+1] == grid[j+2]) {
					if(grid[j] == symbol[i]) {
						return symbol[i];
					}
				}
			}
		}
	}

	return ' ';
}