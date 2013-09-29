
var $body = $('body'),
	$frame = $body.find('#frame'),
    clientType = '', hashPage = '';

// 禁用缓存
$.ajaxSetup({
    cache: false
});
	
// 绑定链接
$body.delegate('[href]', 'click', function(event) {
	event.preventDefault();
	loadFrame($(this).attr('href'));
}).delegate('form [type="submit"]', 'click', function() {
    $(this).closest('form').submit();
});

// hash改变时自动加载子页面
$(window).on('hashchange', function(event) {
	event.preventDefault();
	var hash = location.hash;
	if (hash && hash !== '#' && hash !== hashPage) {
		loadFrame(hash);
	}
});

// 加载子页面
function loadFrame(hash, success) {
    $.ajax({
        type: 'get',
        url: '/' + clientType + hash.substr(1) + '.html',
        success: function(resTxt) {
            location.hash = hashPage = hash;	// 顺序: hashPage > location.hash
            $frame.html(resTxt);
            success && success();
        }
    });
}
// 刷新子页面
function reloadFrame(success) {
	loadFrame(location.hash, success);
}
