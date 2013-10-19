
var path = require('path');

module.exports = function(app, config) {
    var lectureList = app.get('lectureList'),
        fileList = app.get('fileList'),
        messageList = app.get('messageList');
	
    // 通用操作
    /* 验证码 */
    app.use(require('./vcode'));
    app.get('/do/vcode', function(req, res) {
        var action = req.query['action'],
            vcodeInfo = req.makeVcode(action);
        res.send({
            ok: 1,
            vcodeInfo: vcodeInfo
        });
    });
    /* 文件下载 */
    app.get('/do/downfile', function(req, res) {
        var fid = parseInt(req.query['fid']),
            file = fileList({
                id: fid
            }).first();
        if (! file) {
            res.send(403);
            return;
        }
        fileList({
            id: fid
        }).update({
                timesDown: ++ file.timesDown
            });
        var filepath = path.join(config.shareDir, ''+file.lectid, file.name);
        res.download(filepath, encodeURI(file.name));   // encodeURI
    });
}