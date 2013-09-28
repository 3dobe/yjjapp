
var $mainFrame = $('#main-frame'),
	env = ['development', 'production'][0],
	hashSubPage = location.hash || '#/welcome';

// 绑定链接
$('body').delegate('[href]', 'click', function(event) {
	event.preventDefault();
	loadSubPage($(this).attr('href'));
}).delegate('[data-toggle="page"]', 'click', function() {
    $('[data-toggle="page"]').parent('li').removeClass('active');
    $(this).parent('li').addClass('active');
}).delegate('form [type="submit"]', 'click', function() {
    $(this).closest('form').submit();
});

var $nav = $('#nav');
$nav.find('#nav-collapse').delegate('[href]', 'click', function() {
    $nav.find('.navbar-toggle').click();
});

// 加载默认子页
loadSubPage(hashSubPage);

// 开发模式下 禁用一切缓存
if (env === 'development') {
	$.ajaxSetup({
		cache: false
	});
}

// hash改变时自动加载子页面
$(window).on('hashchange', function(event) {
	event.preventDefault();
	var hash = location.hash;
	if (hash && hash !== '#' && hash !== hashSubPage) {
		loadSubPage(hash);
	}
});

// 加载子页面
function loadSubPage(hash) {
	$.ajax({
		type: 'get',
		url: hash.substr(1) + '.html',
		success: function(htmlTxt) {
			window.location.hash = hashSubPage = hash;
			$mainFrame.html(htmlTxt);
		}
	});
}
