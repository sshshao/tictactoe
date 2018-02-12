var path = require('path');

exports.nextMove = function(req, res) {
	var grid = req.body.grid;
	var winner = '/';

	if(req.body.grid) {
		grid = req.body.grid;

		//check if player wins
		winner = checkWinner(grid);
		if(winner == 'X') {
			sendExternalResult(res, grid, winner);
			return;
		}

		//draw if is a dead game
		if(isDeadGame(grid)) {
			winner = ' ';
			sendExternalResult(res, grid, winner);
			return;
		}


		//computer move
		//check if match point exists, if no, pick random grid
		var com_move = criticalMove(grid);
		if(com_move == -1){
			com_move = randomMove(grid);
		}
		grid[com_move] = 'O';

		winner = checkWinner(grid, com_move);

		/*
		//draw if is a dead game
		if(isDeadGame(grid)) {
			winner = ' ';
			sendExternalResult(res, grid, winner);
			return;
		}
		*/

		//winner: ' '=draw, 'X'=player, 'O'=computer, '/'=none
		if(winner == '/') {
			res.send({
				'code': 200,
				'grid': grid,
			});
		}
		else {
			sendExternalResult(res, grid, winner);
		}
	}
	else {
		res.send({
			'code': 200,
			'grid': grid
		});
	}
}

function sendExternalResult(res, grid, winner) {
	res.send({
		'code': 200,
		'grid': grid,
		'winner': winner
	});
}

function criticalMove(grid) {
	//check if any match point exists
	//return index if computer moves, -1 if no move
	var empties = [];
	for(var i=0; i<9; i++) {
		if(grid[i] == ' ') {
			empties.push(i);
		}
	}

	for(var i=0; i<empties.length; i++) {
		var index = checkConsecutiveTarget(grid, empties[i], 'O');
		if(index != -1) {
			return index;
		}
	}

	for(var i=0; i<empties.length; i++) {
		var index = checkConsecutiveTarget(grid, empties[i], 'X');
		if(index != -1) {
			return index;
		}
	}

	return -1;
}

function randomMove(grid) {
	for(var i = 0; i < 9; i++) {
		if(grid[i] == ' ') {
			return i;
		}
	}

	return -1;
}

function checkWinner(grid) {
	//check for wins
	var board = toGameBoard(grid);

	for(var i = 0; i < 7; i++) {
		if(i == 0) {
			if((grid[i] == grid[i+1] && grid[i+1] == grid[i+2])
				|| (grid[i] == grid[i+3] && grid[i+3] == grid[i+6])
				|| (grid[i] == grid[i+4] && grid[i+4] == grid[i+8])) {
				if(grid[i] == 'X')	return 'X';
				if(grid[i] == 'O') 	return 'O';
			}
		}

		if(i == 1) {
			if(grid[i] == grid[i+3] && grid[i+3] == grid[i+6]) {
				if(grid[i] == 'X')	return 'X';
				if(grid[i] == 'O') 	return 'O';
			}
		}

		if(i == 2) {
			if((grid[i] == grid[i+2] && grid[i+2] == grid[i+4])
				|| (grid[i] == grid[i+3] && grid[i+3] == grid[i+6])) {
				if(grid[i] == 'X')	return 'X';
				if(grid[i] == 'O') 	return 'O';
			}
		}

		if(i == 3) {
			if(grid[i] == grid[i+1] && grid[i+1] == grid[i+2]) {
				if(grid[i] == 'X')	return 'X';
				if(grid[i] == 'O') 	return 'O';
			}
		}

		if(i == 6) {
			if(grid[i] == grid[i+1] && grid[i+1] == grid[i+2]) {
				if(grid[i] == 'X')	return 'X';
				if(grid[i] == 'O') 	return 'O';
			}
		}
	}

	return '/';
}

function isDeadGame(grid) {
	var empties = [];

	for(var i=0; i<9; i++) {
		if(grid[i] == ' ') {
			empties.push(i);
		}
	}

	/*
	if(empties.length < 3) {
		for(var i=0; i<empties.length; i++) {
			if(checkConsecutive(grid, empties[i]) != -1) {
				return false;
			}
		}
		return true;
	}
	*/
	if(empties.length == 0)	return true;

	return false;
}

function checkConsecutive(grid, index) {
	var row = Math.floor(index/3);
	var col = Math.floor(index%3);
	var board = toGameBoard(grid);

	console.log(row + ", " + col);

	//check for vertical grids
	if(row == 0) {
		if(board[row+1][col] == board[row+2][col]) {
			return row*3 + col;
		}
	}
	if(row == 1) {
		if(board[row-1][col] == board[row+1][col]) {
			return row*3 + col;
		}
	}
	if(row == 2) {
		if(board[row-1][col] == board[row-2][col]) {
			return row*3 + col;
		}
	}
	//check for horizontal grids
	if(col == 0) {
		if(board[row][col+1] == board[row][col+2]) {
			return row*3 + col;
		}
	}
	if(col == 1) {
		if(board[row][col-1] == board[row][col+1]) {
			return row*3 + col;
		}
	}
	if(col == 2) {
		if(board[row][col-1] == board[row][col-2]) {
			return row*3 + col;
		}
	}
	//check for slopes
	if(row == 0 && col == 0) {
		if(board[row+1][col+1] == board[row+2][col+2]) {
			return row*3 + col;
		}
	}
	if(row == 1 && col == 1) {
		if(board[row-1][col-1] == board[row+1][col+1]) {
			return row*3 + col;
		}
		if(board[row-1][col+1] == board[row+1][col-1]) {
			return row*3 + col;
		}
	}
	if(row == 2 && col == 2) {
		if(board[row-1][col-1] == board[row-2][col-2]) {
			return row*3 + col;
		}
	}
	if(row == 0 && col == 2) {
		if(board[row+1][col-1] == board[row+2][col-2]) {
			return row*3 + col;
		}
	}
	if(row == 2 && col == 0) {
		if(board[row-1][col+1] == board[row-2][col+2]) {
			return row*3 + col;
		}
	}

	return -1;
}

function checkConsecutiveTarget(grid, index, symbol) {
	var row = Math.floor(index/3);
	var col = Math.floor(index%3);
	var board = toGameBoard(grid);

	//check for vertical grids
	if(row == 0) {
		if(board[row+1][col] == board[row+2][col] && board[row+1][col] == symbol) {
			return row*3 + col;
		}
	}
	if(row == 1) {
		if(board[row-1][col] == board[row+1][col] && board[row-1][col] == symbol) {
			return row*3 + col;
		}
	}
	if(row == 2) {
		if(board[row-1][col] == board[row-2][col] && board[row-1][col] == symbol) {
			return row*3 + col;
		}
	}
	//check for horizontal grids
	if(col == 0) {
		if(board[row][col+1] == board[row][col+2] && board[row][col+1] == symbol) {
			return row*3 + col;
		}
	}
	if(col == 1) {
		if(board[row][col-1] == board[row][col+1] && board[row][col-1] == symbol) {
			return row*3 + col;
		}
	}
	if(col == 2) {
		if(board[row][col-1] == board[row][col-2] && board[row][col-1] == symbol) {
			return row*3 + col;
		}
	}
	//check for slopes
	if(row == 0 && col == 0) {
		if(board[row+1][col+1] == board[row+2][col+2] && board[row+1][col+1] == symbol) {
			return row*3 + col;
		}
	}
	if(row == 1 && col == 1) {
		if(board[row-1][col-1] == board[row+1][col+1] && board[row-1][col-1] == symbol) {
			return row*3 + col;
		}
		if(board[row-1][col+1] == board[row+1][col-1] && board[row-1][col+1] == symbol) {
			return row*3 + col;
		}
	}
	if(row == 2 && col == 2) {
		if(board[row-1][col-1] == board[row-2][col-2] && board[row-1][col-1] == symbol) {
			return row*3 + col;
		}
	}
	if(row == 0 && col == 2) {
		if(board[row+1][col-1] == board[row+2][col-2] && board[row+1][col-1] == symbol) {
			return row*3 + col;
		}
	}
	if(row == 2 && col == 0) {
		if(board[row-1][col+1] == board[row-2][col+2] && board[row-1][col+1] == symbol) {
			return row*3 + col;
		}
	}

	return -1;
}

function toGameBoard(grid) {
	var board = [
		[grid[0], grid[1], grid[2]],
		[grid[3], grid[4], grid[5]],
		[grid[6], grid[7], grid[8]]
	];

	return board;
}