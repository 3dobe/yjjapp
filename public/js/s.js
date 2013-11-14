
clientType = 's';   // 客户端类型

$.get('/do/s/me', function(resObj){
	var lectid = resObj['lectid'],
		spkName = resObj['spkName'];
	if (lectid) { // 已有讲座
		hashPage = location.hash || '#/view';
		$navbar.find('.sec').addClass('hidden')
			.filter('#sec-in').removeClass('hidden');
		$navbar.find('#username').text(spkName);
	} else {
		hashPage = location.hash || '#/enter';
		$navbar.find('.sec').addClass('hidden')
			.filter('#sec-out').removeClass('hidden');
	}
	// 加载子页面
	loadFrame(hashPage);
});