/*
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
*/

$(document).ready(function() {
	$('.game-grid').click(function(event) {
		if($(this).text() != ' ')	return;
		if($('.game-result-msg').attr('result') != '-1')	return;

		$(this).text('X');
		var grid = createDataPacket();

		$.ajax({
			type: 'POST',
			url: '/ttt/play',
			dataType: 'json',
			data: {'grid': grid, 'move': $(this).attr('grid-index')},
			success: function(res) {
				for(var i = 0; i < 9; i++) {
					if(res.grid[i] != ' ') {
						$('#game-grid-'+i).text(res.grid[i]);
					}
				}

				console.log(res.winner);

				if(res.winner == 'X') {
					$('.game-result-msg').text("You won!");
					$('.game-result-msg').attr('result', '1');
				}
				else if(res.winner == 'O') {
					$('.game-result-msg').text("You lost!");
					$('.game-result-msg').attr('result', '2');
				}
				else if(res.winner == ' ') {
					$('.game-result-msg').text("Draw!");
					$('.game-result-msg').attr('result', '0');
				}
			}
		});
	});


	

	
});


function sign_in() {
	$('#overlay-signin').css('display', 'block');
}

function sign_up() {
	$('#overlay-signup').css('display', 'block');
}

function createDataPacket() {
	var grid = [];
	for(var i = 0; i < 9; i++) {
		grid.push($('#game-grid-'+i).text());
	}

	return grid;
}

window.onclick = function(event) {
    if (event.target == modal) {
        $('#overlay-signin').css('display', 'none');
    }
}