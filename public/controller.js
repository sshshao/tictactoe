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

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
	if (event.target == document.getElementById('overlay-signin') 
		|| event.target == document.getElementById('overlay-signup')) {
        event.target.style.display = "none";
    }
}

$(document).ready(function() {
	$('.game-playarea').hide();
	$('#navbar-btn-signout').hide();
	$('.game-result-msg').hide();

	$('.game-grid').click(function(event) {
		if($(this).text() != ' ')	return;
		if($('.game-result-msg').attr('result') != '-1')	return;

		$(this).text('X');
		var grid = createGridPacket();

		$.ajax({
			type: 'POST',
			url: 'ttt/play',
			dataType: 'json',
			data: {'grid': grid, 'move': $(this).attr('grid-index')},
			success: function(res) {
				for(var i = 0; i < 9; i++) {
					if(res.grid[i] != ' ') {
						$('#game-grid-'+i).text(res.grid[i]);
					}
				}

				$('.game-result-msg').show();
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


function open_sign_in() {
	$('#overlay-signin').css('display', 'block');
}

function open_sign_up() {
	$('#overlay-signup').css('display', 'block');
}

function sign_in() {
	console.log("SIGN IN");
	if($('#signin-username').val() == "" || $('#signin-pw').val() == "") {
		console.log("NOT VALID");
		return;
	}
	var account = createSigninPacket();

	$.ajax({
		type: 'POST',
		url: '/login',
		dataType: 'json',
		data: account,
		success: function(res) {
			$('#navbar-btn-signout').show();
			$('#navbar-btn-signin').hide();
			$('#nav-span-or').hide();
			$('#navbar-btn-signup').hide();
			$('#overlay-signin').css('display', 'none');

			$('.entrance-msg').hide();
			$('.game-playarea').show();
		}
	});
}

function sign_up() {
	if($('#signup-username').val() == "" || $('#signup-email').val() == "" 
		|| $('#signup-pw').val() == "") {
		return;
	}
	var account = createSignupPacket();

	$.ajax({
		type: 'POST',
		url: '/adduser',
		dataType: 'json',
		data: account,
		success: function(res) {
			$('#navbar-btn-signout').show();
			$('#navbar-btn-signin').hide();
			$('#nav-span-or').hide();
			$('#navbar-btn-signup').hide();
			$('#overlay-signup').css('display', 'none');
		}
	});
}

function sign_out() {
	console.log("SIGN OUT");
	$.ajax({
		type: 'POST',
		url: '/logout',
		dataType: 'json',
		success: function(res) {
			$('#navbar-btn-signin').show();
			$('#nav-span-or').show();
			$('#navbar-btn-signup').show();
			$('#navbar-btn-signout').hide();

			$('.entrance-msg').show();
			$('.game-playarea').hide();
			$('.game-result-msg').hide();
		}
	});
}

function createSigninPacket() {
	var data = {
		'username': $('#signin-username').val(),
		'password': $('#signin-pw').val()
	};
	
	return data;
}

function createSignupPacket() {
	var data = {
		'username': $('#signup-username').val(),
		'email': $('#signup-email').val(),
		'password': $('#signup-pw').val()
	};
	
	return data;
}

function createGridPacket() {
	var grid = [];
	for(var i = 0; i < 9; i++) {
		grid.push($('#game-grid-'+i).text());
	}

	return grid;
}