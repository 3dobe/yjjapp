
clientType = 's';   // 客户端类型

$.get('/do/s/me', function(resObj) {
    var lectid = resObj['lectid'];
    if (lectid) { // 已有讲座
        hashPage = location.hash || '#/view';
        $navbar.find('#sec-in').removeClass('hidden');
    } else {
        hashPage = location.hash || '#/enter';
        $navbar.find('#sec-out').removeClass('hidden');
    }
    // 加载子页面
    loadFrame(hashPage);
});