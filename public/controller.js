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