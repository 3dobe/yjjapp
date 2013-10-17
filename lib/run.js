
var path = require('path'),
    fs = require('fs'),
	_ = require('underscore'),
	taffy = require('taffydb').taffy,
	Speaker = require('./speaker'),
	Lecture = require('./lecture'),
	lectureList = taffy([]),
	speakerList = taffy([]),
    audienceList = taffy([]),
    fileList = taffy([]),
    maxSizeMB = 3,  // 3M
    maxSize = maxSizeMB * 1024 * 1024;

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
				msg : '验证码不正确'
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
		var dir = path.join(config.shareDir, ''+lectid);
		fs.mkdirSync(dir);
		res.send({
			ok : 1,
			msg : '讲座创建成功'
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
				msg: '没有上传文件'
			});
			return;
		}
        var fileTmpPath = file.path,
            filesize = fs.statSync(fileTmpPath);
        if (filesize > maxSize) {
            res.send({
                ok: 0,
                msg: '文件大小超过 '+ maxSizeMB +'M'
            });
            return;
        }
        // 获取讲座id
        var spkid = req.session['speakerId'],
            lectid = lectureList({
                spkid: spkid
            }).first().id;
		// 转移文件
        var dir = path.join(config.shareDir, ''+lectid);    // path.join 参数必须是字符串
		fs.rename(fileTmpPath, path.join(dir, filename), function() {
            fileList.insert({
                id: fileList({}).count() + 1,
                name: filename,
                size: filesize,
                timesDown: 0
            });
			res.send({
				ok: 1,
				msg: '文件上传成功'
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
        var dir = path.join(config.shareDir, ''+lectid),
            resObj = {
				ok: 1,
				files: []
			};
		fs.readdir(dir, function(err, files){
			_.each(files, function(file, i) {
                var filepath = path.join(dir, file),
                    stats = fs.statSync(filepath);
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

    /* 文件下载 */
    app.get('/do/s/downfile', function(req, res) {
        var fid = req.query['fid'],
            file = fileList({
                id: fid
            }), filepath = path.join(config.shareDir, file.lectid, file.name);
        if (! fs.existsSync(filepath)) {
            res.send(401);
            return;
        }
        res.sendfile(filepath);
    });

	/* 讲座内部信息 */
	app.get('/do/s/view', function(req, res) {
        var spkid = req.session['speakerId'],
            lectkey = lectureList({
                spkid: spkid
            }).first().key;
        res.send({
            ok : 1,
            lectkey : lectkey
        });
	});

    //听端操作
    /*加入讲座*/
    app.post('/do/a/join', function(req,res){
        var key = req.body['key'],
            lect = lectureList({
                key: key
            }).first();
        if(! lect){
            res.send({
                ok : 0,
                msg : '没有该讲座'
            })
            return ;
        }
        var audiId = lectureList({}).count() + 1,
            audience = new Audience(audiId, '听众'+audiId);
        audienceList.insert(audience);
        //绑定audience和lecture
        lect.addAudi(audience);
        //绑定session和audience
        req.session['audienceId'] = audience.id;
        res.send({
            ok : 1,
            msg : '成功加入'
        })
    });
}
