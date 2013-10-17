
var path = require('path'),
    fs = require('fs'),
	_ = require('underscore'),
	taffy = require('taffydb').taffy,
	lectureList = taffy([]),
    fileList = taffy([]);

module.exports = function(app, config) {
    app.set('lectureList', lectureList);
    app.set('fileList', fileList);

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

        console.log(file);

        var filepath = path.join(config.shareDir, ''+file.lectid, file.name);
        res.sendfile(filepath);
        fileList({
            id: fid
        }).update({
                timesDown: ++ file.timesDown
            });
    });

    require('./s')(app, config);
    require('./a')(app, config);
}



