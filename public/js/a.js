
clientType = 'a';   // 客户端类型

$.get('/do/a/me', function(resObj) {
	var lectid = resObj['lectid'],
		audiName = resObj['audiName'];
	if (lectid) { // 已有讲座
		hashPage = location.hash || '#/view';
		$navbar.find('.sec').addClass('hidden')
			.filter('#sec-in').removeClass('hidden');
		$navbar.find('#username').text(audiName);
	} else {
		hashPage = location.hash || '#/join';
		$navbar.find('.sec').addClass('hidden')
			.filter('#sec-out').removeClass('hidden');
	}
	// 加载子页面
	loadFrame(hashPage);
});

heartbeat();
setInterval(heartbeat, 1 * 60 * 1000);  // 1 min
function heartbeat() {
	$.get('/do/a/heartbeat');
}
