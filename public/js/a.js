
clientType = 'a';   // 客户端类型
var heartbeatTimerId = null;

$.get('/do/a/me', function(resObj) {
	var audiName = resObj['audiName'];
	if (audiName) { // 已有讲座
		$navbar.find('#username').text(audiName);
		$window.trigger('enter_lecture');
	} else {
		$window.trigger('leave_lecture');
	}
});

// events with a-client
$window.on('enter_lecture', function(event, hash){
	clearInterval(heartbeatTimerId);
	heartbeatTimerId = setInterval(heartbeat, 15 * 1000);  // 15s
	$navbar.find('.sec').addClass('hidden')
		.filter('#sec-in').removeClass('hidden');
	loadFrame(hash || location.hash || '#/view');
}).on('leave_lecture', function(event){
	clearInterval(heartbeatTimerId);
	heartbeatTimerId = null;
	$navbar.find('.sec').addClass('hidden')
		.filter('#sec-out').removeClass('hidden');
	loadFrame('#/join');
});

function heartbeat() {
	ajax({
		url: '/do/a/heartbeat',
		success: function(res){
			if (! res['ok']) $window.trigger('leave_lecture');
		}
	});
}
