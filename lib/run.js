
var fs = require('fs'),
	_ = require('underscore');

module.exports = function(app, config) {
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
	
	// 讲端操作
    /* 开启讲座 */
	app.post('/do/s/open', function(req, res) {
		var action = 'open',
			vcode = Number(req.body["vcode"]),
            pass = req.validVcode(action, vcode);
        // 验证失败
		if (! pass) {
            res.send({
                ok : 0,
                msg : "失败了,heyheyhey"
            });
            return;
		}
        // 验证成功
        var lname = req.body['lname'],
            lpwd = req.body['lpwd'];



        res.send({
            ok : 1,
            msg : "成功了,yoyoyo"
        });
	});

	/* 上传文件 */
	app.post('/do/s/savefile',function(req,res){
		var file = req.files && req.files['file'];
		console.log(file);
		if (file.originalFilename) {
			fs.rename(file.path, config.shareDir + '/' + file.originalFilename, function() {
				res.send({
					ok : 1,
					msg : "yoyoyo"
				});
			});
		} else {
			res.send({
				ok : 0,
				msg : "没有文件"
			});
		}
	});

	/* 文件列表 */
	app.get('/do/s/filelist',function(req,res){
		var shareDir = config.shareDir,
			resObj ={
				ok: 1,
				fileList: []
			};
		fs.readdir(shareDir, function(err,files){
			_.each(files,function(val, i) {
			   resObj.fileList.push({
				   name: val,
				   size: fs.statSync(shareDir+ "/"+val).size,
				   timesDown : 0,
				   description : ""

			   })
			});
			res.send(resObj);
		});
	});

    /* 讲座内部信息 */
	app.get('/do/s/view', function(req, res) {
		
	});
}
