
var $mainFrame = $('#main-frame'),
	env = ['development', 'production'][0],
	hrefSubPage = 'welcome.html';

// 绑定链接
$('body').delegate('[href]', 'click', function(event) {
	event.preventDefault();
	loadSubPage($(this).attr('href'));
});
// 加载默认子页
loadSubPage(hrefSubPage);

// 开发模式下 禁用一切缓存
if (env === 'development') {
	$.ajaxSetup({
		cache: false
	});
}

// hash改变时自动加载子页面
$(window).on('hashchange', function(event) {
	event.preventDefault();
	var href = window.location.hash.substr(1);
	if (href && href !== hrefSubPage) {
		loadSubPage(href);
	}
});

// 加载子页面
function loadSubPage(href) {
	$.ajax({
		type: 'get',
		url: href,
		success: function(htmlTxt) {
			window.location.hash = hrefSubPage = href;
			$mainFrame.html(htmlTxt);
		}
	});
}
