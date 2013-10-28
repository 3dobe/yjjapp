
var path = require('path'),
	_ = require('underscore'),
	Audience = require('./audience'),
	Message = require('./message'),
    Vote = require('./vote');

module.exports = function(app, config) {
	var speakerTaffy = app.get('speakerTaffy'),
		lectureTaffy = app.get('lectureTaffy'),
		audienceTaffy = app.get('audienceTaffy'),
		fileTaffy = app.get('fileTaffy'),
		messageTaffy = app.get('messageTaffy'),
        voteTaffy = app.get('voteTaffy');

	// 听端操作
	/* 加入讲座 */
	app.get('/do/a/join', function(req, res){
		var isQr = !! req.query['qr'],
			key = req.query['key'],
            audiname = req.query['nick'],
			lect = lectureTaffy({
				key: key
			}).first();
		if (! lect) {
			isQr ? res.redirect('/a/#/join'):
                res.send({
                    ok : 0,
                    msg : '没有该讲座'
                });
			return;
		}
        if (audienceTaffy({
            name: audiname,
            lectid: lect.id
        }).first()){
            res.send({
                ok: 0,
                msg: '已有该昵称'
            });
            return;
        }
		var audiId = audienceTaffy.nextId ++,
			audience = new Audience(audiId, audiname);
		audienceTaffy.insert(audience);
		//绑定audience和lecture
		lect.addAudi(audience);
		//绑定session和audience
		req.session['audienceId'] = audience.id;
	    isQr ? res.redirect('/a/#/view'):
		    res.send({
                ok : 1,
                msg : '成功加入'
			});
	});

	/* 听端基本信息 */
	app.get('/do/a/view',function(req, res){
		var audiId = req.session['audienceId'],
			audience = audienceTaffy({
				id : audiId
			}).first(),
			lectid = audience.lectid,
			lecture = lectureTaffy({
				id : lectid
			}).first();

		res.send({
			ok : 1,
			audiname : audience.name,
			lectname : lecture.name,
			lectkey : lecture.key
		});
	});

	/* 听端文件列表 */
	app.get('/do/a/filelist', function(req, res){
		// 获取讲座id
		var audiId = req.session['audienceId'],
			lectid = audienceTaffy({
				id : audiId
			}).first().lectid,
			fileList = fileTaffy({
				lectid: lectid
			}).get();
		res.send({
			ok: 1,
            fileList: fileList
		});

	});

	/* 听端听众列表 */
	app.get('/do/a/audiencelist', function(req, res){
		var audiId = req.session['audienceId'],
			lectid = audienceTaffy({
				id : audiId
			}).first().lectid,
			audienceList = audienceTaffy({
				lectid: lectid
			}).get();
		res.send({
			ok : 1,
			audienceList : audienceList
		})
	});

	/* 听端发送消息 */
	app.post('/do/a/sendmsg', function(req, res){
		var audiId = req.session['audienceId'],
			lectid = audienceTaffy({
				id : audiId
			}).first().lectid,
			text = req.body['msg'],
			msgid = messageTaffy.nextId ++,
			msg = new Message(msgid, lectid, audiId, text);
		messageTaffy.insert(msg);
		res.send({
			ok : 1,
			msg : '成功发出'
		})
	});

	/* 消息列表 */
	app.get('/do/a/msglist', function(req, res){
		var audiId = req.session['audienceId'],
			lectid = audienceTaffy({
				id : audiId
			}).first().lectid,
            msgList = _.map(messageTaffy({
                lectid: lectid
            }).get(), function(msg) {
                var audiname = audienceTaffy({
                    id: msg.audiId
                }).first().name;
                msg.audienceName = audiname;    // 添加audienceName属性
                return msg;
            });
		res.send({
			ok : 1,
			msgList : msgList
		})
	});

    /* 听端心跳 */
    app.get('/do/a/heartbeat', function(req, res) {
        var audiId = req.session['audienceId'],
            audience = audienceTaffy({
                id : audiId
            }).first();
        audience.hit = Date.now();
        res.send(200);
    });
    var clearInterval = 10 * 1000; // 120 s
    setInterval(clearAudience, clearInterval);
    function clearAudience() {
        audienceTaffy({}).each(function(audi) {
            if (Date.now() - audi.hit > clearInterval) {
                audienceTaffy({
                    id: audi.id
                }).remove();
            }
        });
    }

	/* 听端退出 */
	app.get('/do/a/exit', function(req, res) {
		var audienceId = req.session['audienceId'];
		audienceTaffy({
			id: audienceId
		}).remove();
		delete req.session['audienceId'];
		res.send({
			'ok': 1,
			'msg': '退出成功'
		});
	});


    /* 投票 */
    app.get('/do/a/vote', function(req, res){
        var spkid = req.session['speakerId'],
            lectid = lectureTaffy({
                spkid: spkid
            }).first().id,
            vid = parseInt(req.query['vid']),
            word = req.query['word'],
            vote = voteTaffy({
                lectid: lectid,
                id: vid
            }).first();
        if (! vote) {
            return res.send({
                ok: 0,
                msg: '投票不存在'
            });
        }
        if (vote.state !== Vote.States.ACTIVE) {
            return res.send({
                ok: 0,
                msg: '投票已关闭'
            });
        }
        if (! _.has(vote.options, word)) {
            return res.send({
                ok: 0,
                msg: '选项不存在'
            })
        }
        vote.addOne(word);
        res.send({
            ok : 1,
            msg:'投票成功'
        });
    });
}