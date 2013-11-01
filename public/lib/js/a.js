
clientType = 'a';   // 客户端类型

$.get('/do/a/me', function(resObj) {
    var lectid = resObj['lectid'];
    if (lectid) { // 已有讲座
        hashPage = location.hash || '#/view';
    } else {
        hashPage = location.hash || '#/join';
    }
    // 加载子页面
    loadFrame(hashPage);
});

heartbeat();
setInterval(heartbeat, 1 * 60 * 1000);  // 1 min
function heartbeat() {
    $.get('/do/a/heartbeat');
}
