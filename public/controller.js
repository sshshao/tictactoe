$(document).ready(function() {
	$.ajax({
		url: "http://127.0.0.1:8080/ttt"
	}).then(function(data) {
		//hide input form, show welcome message and game board
		$('.welcome-form').hide();

		$('.welcome-message')
			.show()
			.append(data.name + ", ")
			.append(new Date($.now()));
		$('.game-playarea').show();
	});
});

$(document).ready(function() {
	$('.test').click(function() {
		console.log("clicked");
		$('.test').hide();
	});
});