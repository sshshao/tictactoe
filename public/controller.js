$(document).ready(function() {
	$('.welcome-btn').click(function() {
		$.ajax({
			type: 'POST',
			url: '/ttt',
			dataType: 'json',
			data: $('#welcomeInputName').serialize(),
			success: function(res) {
				var d = new Date($.now());

				//hide input form, show welcome message and game board
				$('.welcome-form').hide();
				$('#welcome-msg-box').text('Hello, ' + res.name + ', ' 
					+ d.getMonth() + "/" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes());
				$('.welcome-msg').show();
				$('.game-playarea').show();
			}
		});
	});
});

$(document).ready(function() {
	$('.game-grid').click(function(event) {
		if($(this).text() != ' ')	return;
		console.log($('.game-result-msg').attr('result'));
		if($('.game-result-msg').attr('result') != '0')	return;

		$(this).text('X');
		var grid = createDataPacket();

		$.ajax({
			type: 'POST',
			url: '/ttt/play',
			dataType: 'json',
			data: {'grid': grid},
			success: function(res) {
				for(var i = 0; i < 9; i++) {
					if(res.grid[i] != ' ') {
						$('#game-grid-'+i).text(res.grid[i]);
					}
				}

				if(res.winner == 'X') {
					$('.game-result-msg').text("You won!");
					$('.game-result-msg').attr('result', '1');
				}
				else if(res.winner == 'O') {
					$('.game-result-msg').text("You lost!");
					$('.game-result-msg').attr('result', '2');
				}
			}
		});
	});
});

function createDataPacket() {
	var grid = [];
	for(var i = 0; i < 9; i++) {
		grid.push($('#game-grid-'+i).text());
	}

	return grid;
}