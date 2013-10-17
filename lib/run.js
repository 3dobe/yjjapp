
var fs = require('fs'),
	_ = require('underscore'),
	taffy = require('taffydb').taffy,
	Speaker = require('./speaker'),
	Lecture = require('./lecture'),
	lectureList = taffy([]),
	speakerList = taffy([]),
    audienceList = taffy([]),
    fileList = taffy([]);

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
			vcode = Number(req.body['vcode']),
			pass = req.validVcode(action, vcode);
		// 验证失败 跳出
		if (! pass) {
			res.send({
				ok : 0,
				msg : '失败了,heyheyhey'
			});
			return;
		}
		// 建立演讲者和讲座
		var lname = req.body['lname'],
			lpwd = req.body['lpwd'],
			spkid = speakerList({}).count() + 1,
			speaker = new Speaker(spkid, '用户' + spkid),
			lectid = lectureList({}).count() + 1,
			lecture = new Lecture(lectid, lname, speaker.id, lpwd);
		speakerList.insert(speaker);
		lectureList.insert(lecture);
		// speaker与lecture绑定
		speaker.createLecture(lecture);
		// speaker与session绑定
		req.session['speakerId'] = speaker.id;
		// 建立讲座的文件目录
		var dir = config.shareDir + '/' + lectid;
		fs.mkdirSync(dir);
		res.send({
			ok : 1,
			msg : '成功了,yoyoyo'
		});
	});

	/* 上传文件 */
	app.post('/do/s/savefile',function(req, res){
		var file = req.files && req.files['file'],
			filename = file && file.originalFilename;
		// 没有文件 跳出
		if (! filename) {
			res.send({
				ok: 0,
				msg: '没有文件'
			});
			return;
		}
        // 获取讲座id
        var spkid = req.session['speakerId'],
            lectid = lectureList({
                spkid: spkid
            }).first().id;
		// 转移文件
        var dir = config.shareDir + '/' + lectid;
		fs.rename(file.path, dir +  '/' + filename, function() {
			res.send({
				ok: 1,
				msg: 'yoyoyo'
			});
		});
	});

	/* 文件列表 */
	app.get('/do/s/filelist',function(req, res){
        // 获取讲座id
        var spkid = req.session['speakerId'],
            lectid = lectureList({
                spkid: spkid
            }).first().id;

        //或缺文件列表
        var dir = config.shareDir + '/' + lectid,
            resObj = {
				ok: 1,
				files: []
			};
		fs.readdir(dir, function(err, files){
			_.each(files, function(file, i) {
                var path = dir + '/' + file,
                    stats = fs.statSync(path);
                if (stats.isDirectory()) return;
                resObj['files'].push({
				   name: file,
				   size: stats.size,
				   timesDown : 0
                 });
			});
			res.send(resObj);
		});
	});

	/* 讲座内部信息 */
	app.get('/do/s/view', function(req, res) {
		
	});
}
