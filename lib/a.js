
var path = require('path'),
	_ = require('underscore'),
	Lecture = require('./lecture'),
	Audience = require('./audience'),
	Message = require('./message'),
	Vote = require('./vote');

module.exports = function(app, config) {
	var speakerTaffy = app.get('speakerTaffy'),
		lectureTaffy = app.get('lectureTaffy'),
		audienceTaffy = app.get('audienceTaffy'),
		fileTaffy = app.get('fileTaffy'),
		messageTaffy = app.get('messageTaffy'),
		voteTaffy = app.get('voteTaffy'),
		lotteryTaffy = app.get('lotteryTaffy');

	// 听端过程
	app.use(function(req, res, next) {
		req.session['votedList'] = req.session['votedList'] || [];  // 记录已投
		next();
	});

	// 听端操作
	/* 加入讲座 */
	app.get('/do/a/join', function(req, res){
		var key = req.query['key'],
			audiname = req.query['nick'],
			lect = lectureTaffy({
				key: key
			}).first();
		if (! key || ! audiname)
			return res.send({ msg: '讲座序列号/听众昵称不完整' });
		if (! lect)
			return res.send({ msg : '没有该讲座' });
		if (audiname.length > Audience.MAX_LEN_NAME)
			return res.send({ msg: '昵称太长' });
		if (audienceTaffy({
			name: audiname,
			lectid: lect.id
		}).first()) return res.send({ msg: '已有该昵称' });
		var audiId = audienceTaffy.nextId ++,
			audience = new Audience(audiId, audiname);
		audienceTaffy.insert(audience);
		//绑定audience和lecture
		lect.addAudi(audience);
		//绑定session和audience
		req.session['audienceId'] = audience.id;
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
			lect = lectureTaffy({
				id : lectid
			}).first();
		if (lect.qnaState !==Lecture.QnaStates.OPEN)
			return res.send({
				msg : "问答环节还没开始"
			});
		var text = req.body['text'];
		if (! text) return res.send({ msg : '提问内容不能为空' });
		var msgid = messageTaffy.nextId ++,
			msg = new Message(msgid, lectid, audiId, text);
		messageTaffy.insert(msg);
		res.send({
			ok : 1,
			msg : '成功发出'
		});
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
				var audi = audienceTaffy({
					id: msg.audiId
				}).first();
				msg.audienceName = audi ? audi.name : " - ";	// 添加audienceName属性
				return msg;
			});
		res.send({
			ok : 1,
			msgList : msgList
		})
	});
	/* 获得提问状态 */
	app.get('/do/a/getqna',function(req, res){
		var audiId = req.session['audienceId'],
			lectid = audienceTaffy({
				id: audiId
			}).first().lectid,
			lect = lectureTaffy({
				id: lectid
			}).first();
		res.send({
			ok: 1, state: lect.qnaState
		});
	});

	/* 听端心跳 */
	app.get('/do/a/heartbeat', function(req, res) {
		var audiId = req.session['audienceId'] || 0,
			audience = audienceTaffy({
				id : audiId
			}).first();
		if (! audience) return res.send({ msg: '你已经脱离讲座' });
		audience.hit = Date.now();
		res.send({ ok: 1 });
	});
	var clearInterval = 15 * 60 * 1000; // 15 min
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
		delete req.session['votedList'];
		res.send({
			'ok': 1,
			'msg': '退出成功'
		});
	});

	/* 列出投票列表 */
	app.get('/do/a/votelist', function(req, res){
		var audiId = req.session['audienceId'],
			lectid = audienceTaffy({
				id: audiId
			}).first().lectid,
			voteList = voteTaffy({
				lectid: lectid
			}).get();
		res.send({
			ok: 1,
			voteList: voteList,
			votedList: req.session['votedList']
		});
	});
	/* 查看投票 */
	app.get('/do/a/viewvote', function(req, res){
		var audiId = req.session['audienceId'],
			lectid = audienceTaffy({
				id: audiId
			}).first().lectid,
			vid = parseInt(req.query['vid']),
			vote = voteTaffy({
				id: vid,
				lectid: lectid
			}).first();
		if (! vote) return res.send({ msg: '投票不存在' });
		res.send({
			ok : 1,
			vote : vote,
			voted: _.contains(req.session['votedList'], vid)
		});
	});
	/* 投票 */
	app.get('/do/a/vote', function(req, res){
		var audiId = req.session['audienceId'],
			vid = parseInt(req.query['vid']),
			word = req.query['word'],
			lectid = audienceTaffy({
				id: audiId
			}).first().lectid,
			vote = voteTaffy({
				lectid: lectid,
				id: vid
			}).first();
		if (! vote) return res.send({ msg: '投票不存在' });
		if (vote.state !== Vote.States.ACTIVE)
			return res.send({ msg: '投票已关闭' });
		if (! _.has(vote.options, word))
			return res.send({ msg: '选项不存在' });
		var votedList = req.session['votedList'];
		if (_.contains(votedList, vid))
			return res.send({  msg: '已投过票' });
		vote.addOne(word);
		res.send({
			ok : 1,
			msg:'投票成功'
		});
		votedList.push(vid);
	});

	/* 列出抽奖列表 */
	app.get('/do/a/lotterylist', function(req, res){
		var audiId = req.session['audienceId'],
			lectid = audienceTaffy({
				id: audiId
			}).first().lectid,
			lotteryList = lotteryTaffy({
				lectid: lectid
			}).get();
		res.send({
			ok: 1,
			lotteryList: lotteryList
		});
	});

	/* 查看抽奖 */
	app.get('/do/a/viewlottery', function(req, res){
		var audiId = req.session['audienceId'],
			lectid = audienceTaffy({
				id: audiId
			}).first().lectid,
			lyid = parseInt(req.query['lyid']),
			lottery = lotteryTaffy({
				id: lyid,
				lectid: lectid
			}).first();
		if (! lottery) return res.send({ msg: '投票不存在' });
		res.send({
			ok : 1,
			lottery : lottery
		});
	});

	/* 获取个人信息 */
	app.get('/do/a/me', function(req, res) {
		var audienceId = req.session['audienceId'],
			audience = audienceId && audienceTaffy({
				id: audienceId
			}).first();
		res.send({
			'ok': 1,
			'lectid': audience ? audience.lectid : 0,
			'audiId': audienceId || 0,
			'audiName': audience ? audience.name : ''
		});
	});
}