
clientType = 's';   // 客户端类型

$.get('/do/s/me', function(resObj){
	var lectid = resObj['lectid'];
	if (lectid) { // 已有讲座
		hashPage = location.hash || '#/view';
	} else {
		hashPage = location.hash || '#/enter';
	}
	loadFrame(hashPage);
});
updateNavbar();

function updateNavbar(){
	$.get('/do/s/me', function(resObj){
		var lectid = resObj['lectid'],
			lectkey = resObj['lectkey'],
			spkname = resObj['spkname'];
		if (lectid) { // 已有讲座
			$navbar.find('#lectkey').text(lectkey);
			$navbar.find('#username').text(spkname);
			$navbar.find('.sec').addClass('hidden')
				.filter('#sec-in').removeClass('hidden');
		} else {
			$navbar.find('.sec').addClass('hidden')
				.filter('#sec-out').removeClass('hidden');
		}
	});
}