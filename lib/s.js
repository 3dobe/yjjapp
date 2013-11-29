
var path = require('path'),
	fs = require('fs'),
	_ = require('underscore'),
	removeDir = require('./removedir'),
	Speaker = require('./speaker'),
	Lecture = require('./lecture'),
	Vote = require('./vote'),
	Lottery = require('./lottery'),
	maxSizeMB = 3,  // 3M
	maxSize = maxSizeMB * 1024 * 1024;

module.exports = function(app, config) {
	var speakerTaffy = app.get('speakerTaffy'),
		lectureTaffy = app.get('lectureTaffy'),
		audienceTaffy = app.get('audienceTaffy'),
		fileTaffy = app.get('fileTaffy'),
		messageTaffy = app.get('messageTaffy'),
		voteTaffy = app.get('voteTaffy'),
		lotteryTaffy = app.get('lotteryTaffy'),
		pageSize = config.pageSize;

	// 讲端操作
	/* 开启讲座 */
	app.post('/do/s/open', function(req, res) {
		var action = 'open',
			vcode = Number(req.body['vcode']),
			pass = req.validVcode(action, vcode);
		// 验证失败 跳出
		if (! pass) return res.send({ msg : '验证码不正确' });
		// 建立演讲者和讲座
		var lname = req.body['lname'],
			lpwd1 = req.body['lpwd1'],
            lpwd2 = req.body['lpwd2'],
			spkname = req.body['nick'];
		if (! lname || ! lpwd1 || ! spkname)
			return res.send({ msg: '讲座名称/讲座密码/讲者昵称不完整' });
		if (lname.length > Lecture.MAX_LEN_NAME)
			return res.send({ msg: '讲座名称太长' });
        if (lpwd1 !== lpwd2)
            return res.send({ msg: '两次输入密码不一样'});
		if (lpwd1.length > Lecture.MAX_LEN_PWD)
			return res.send({ msg: '讲座密码太长' });
		if (spkname.length > Speaker.MAX_LEN_NAME)
			return res.send({ msg: '昵称太长' });
		var spkid = speakerTaffy.nextId ++,
			speaker = new Speaker(spkid, spkname),
			lectid = lectureTaffy.nextId ++;
			lecture = new Lecture(lectid, lname, speaker.id, lpwd1);
		speakerTaffy.insert(speaker);
		lectureTaffy.insert(lecture);
		// speaker与lecture绑定
		speaker.createLecture(lecture);
		// speaker与session绑定
		req.session['speakerId'] = speaker.id;
		// 建立讲座的文件目录
		var dir = path.join(config.shareDir, ''+lectid);
		fs.mkdirSync(dir);
		res.send({
			ok : 1, msg : '讲座创建成功'
		});
	});
	/* 讲端退出 */
	app.get('/do/s/close', function(req, res) {
		var speakerId = req.session['speakerId'],
			speaker = speakerTaffy({
				id: speakerId
			}).first(),
			lecture = lectureTaffy({
				spkid: speaker.lectid
			}).first();
		if (speaker && lecture) {
			delete req.session['speakerId'];
			speakerTaffy({
				id: speaker.id
			}).remove();
			lectureTaffy({
				id: lecture.id
			}).remove();
			var dir = path.join(config.shareDir, ''+lecture.id);
			removeDir(dir);
		}
		res.send({
			ok: 1, msg: '讲座成功关闭'
		});
	});
	/* 重回管理讲座 */
	app.post('/do/s/enter', function(req, res) {
		var action = 'enter',
			vcode = Number(req.body['vcode']),
			pass = req.validVcode(action, vcode);
		// 验证失败 跳出
		if (! pass) return res.send({ msg : '验证码不正确' });
		// 建立演讲者和讲座
		var lkey = req.body['lkey'],
			lpwd = req.body['lpwd'],
			lect = lectureTaffy({
				 key: lkey, pwd: lpwd
			}).first();
		if (! lect) return res.send({ msg: '输入信息有误' });
		var spkid = lect.spkid;
		// speaker与session绑定
		req.session['speakerId'] = spkid;
		res.send({
			ok : 1, msg : '欢迎回到演讲家'
		});
	});
	/* 讲座基本信息 */
	app.get('/do/s/view', function(req, res) {
		var spkid = req.session['speakerId'],
			speaker = speakerTaffy({
				id: spkid
			}).first(),
			lecture = lectureTaffy({
				spkid: spkid
			}).first();
		res.send({
			ok : 1,
			lectname: lecture.name,
			lectkey: lecture.key
		});
	});
	
	/* 文件列表 */
	app.get('/do/s/filelist',function(req, res){
		var spkid = req.session['speakerId'],
			lectid = lectureTaffy({
				spkid: spkid
			}).first().id,
			fileList = fileTaffy({
				lectid: lectid
			}).get();
		res.send({
			ok: 1, fileList: fileList
		});
	});
	/* 删除文件 */
	app.get('/do/s/delfile',function(req, res) {
		var spkid = req.session['speakerId'],
			lectid = lectureTaffy({
				spkid: spkid
			}).first().id,
			fid = parseInt(req.query['fid']),
			fileP = fileTaffy({
				id: fid,
				lectid: lectid
			});
		if (! fileP.first()) return res.send({ msg: '文件不存在' });
		var filename = fileP.first().name;
		fileP.remove();
		fs.unlink(path.join(config.shareDir, ''+lectid, filename));
		res.send({
			ok: 1, msg: '删除成功'
		});
	});
	/* 上传文件 */
	app.post('/do/s/savefile',function(req, res){
		var file = req.files && req.files['file'],
			filename = file && file.originalFilename;
		// 没有文件 跳出
		if (! filename) return res.send({ msg: '没有上传文件' });
		var fileTmpPath = file.path,
			filesize = fs.statSync(fileTmpPath).size;
		if (filesize > maxSize)
			return res.send({ msg: '文件大小超过 '+ maxSizeMB +'M' });
		// 获取讲座id
		var spkid = req.session['speakerId'],
			lectid = lectureTaffy({
				spkid: spkid
			}).first().id;
		if (fileTaffy({
			lectid: lectid,
			name: filename
		}).first()) return res.send({ msg: '文件已存在' });
		// 转移文件
		var dir = path.join(config.shareDir, ''+lectid),	// path.join 参数必须是字符串
			filepath = path.join(dir, filename);
		fs.rename(fileTmpPath, filepath, function() {
			var newFile = {
				id: fileTaffy.nextId ++,
				name: filename,
				size: filesize,
				timesDown: 0,
				lectid: lectid
			}
			fileTaffy.insert(newFile);
			res.send({
				ok: 1, msg: '文件上传成功'
			});
		});
	});

	/* 讲端听众列表 */
	app.get('/do/s/audiencelist', function(req, res){
		var spkid = req.session['speakerId'],
			page = req.query['page'],
			lectid = lectureTaffy({
				spkid: spkid
			}).first().id,
			audienceList = audienceTaffy({
				lectid: lectid
			}).get(),
			index = pageSize * (page - 1),
			list = audienceList.slice(index, index + pageSize);
		res.send({
			ok : 1,
			total: audienceList.length,
			audienceList : list
		});
	});
	/* 踢除听众 */
	app.get('/do/s/kickaudience', function(req, res){
		var spkid = req.session['speakerId'],
			audiId = parseInt(req.query['aid']),
			lectid = lectureTaffy({
				spkid: spkid
			}).first().id,
			audienceP = audienceList = audienceTaffy({
				lectid: lectid,
				id: audiId
			});
		if (! audienceP.first()) return res.send({ msg: '听众不存在' });
		audienceP.remove();
		res.send({
			ok : 1, msg: '听众已被踢除'
		});
	});

	/* 消息列表*/
	app.get('/do/s/msglist', function(req, res){
		var spkid = req.session['speakerId'],
			lectid = lectureTaffy({
				spkid: spkid
			}).first().id,
			msgList = _.map(messageTaffy({
				lectid: lectid
			}).get(), function(msg) {
				var audiname = audienceTaffy({
						id: msg.audiId
					}).first().name;
				msg.audienceName = audiname;	// 添加audiname属性
				return msg;
			});
		res.send({
			ok : 1, msgList : msgList
		});
	});

	/* 列出投票列表 */
	app.get('/do/s/votelist', function(req, res){
		var spkid = req.session['speakerId'],
			lectid = lectureTaffy({
				spkid: spkid
			}).first().id,
			voteList = voteTaffy({
				lectid: lectid
			}).get();
		res.send({
			ok : 1, 
			voteList : voteList
		});
	});
	/* 查看投票 */
	app.get('/do/s/viewvote', function(req, res){
		var spkid = req.session['speakerId'],
			lectid = lectureTaffy({
				spkid: spkid
			}).first().id,
			vid = parseInt(req.query['vid']),
			vote = voteTaffy({
				lectid: lectid,
				id: vid
			}).first();
		if (! vote) return res.send({ msg: '投票不存在' });
		res.send({
			ok : 1, vote : vote
		});
	});
	/* 添加投票 */
	app.post('/do/s/addvote',function(req, res){
		var spkid = req.session['speakerId'],
			content = req.body['content'],
			words = req.body['words'],
			lect = lectureTaffy({
				spkid: spkid
			}).first(),
			voteId = voteTaffy.nextId ++,
			vote = new Vote(voteId, content, words);
		voteTaffy.insert(vote);
		//绑定vote和lecture
		lect.addVote(vote);
		res.send({
			ok : 1, msg : '添加成功'
		});
	});
	/* 删除投票问题 */
	app.get('/do/s/delvote',function(req, res){
		var spkid = req.session['speakerId'],
			lectid = lectureTaffy({
				spkid: spkid
			}).first().id,
			vid = parseInt(req.query['vid']),
			voteP = voteTaffy({
				id: vid,
				lectid: lectid
			});
		if (! voteP.first()) return res.send({ msg: '投票不存在' });
		voteP.remove();
		res.send({
			ok: 1, msg: '删除成功'
		});
	});
	/* 改变投票状态 */
	app.get('/do/s/setvote',function(req, res){
		var spkid = req.session['speakerId'],
			lectid = lectureTaffy({
				spkid: spkid
			}).first().id,
			vid = parseInt(req.query['vid']),
			state = req.query['state'],
			vote = voteTaffy({
				id: vid,
				lectid: lectid
			}).first();
		if (! vote) return res.send({ msg: '投票不存在' });
		if (! _.contains(Vote.States, state)) 
			return res.send({ msg: '状态不合法' });
		var msg = '';
		if (state === Vote.States.ACTIVE) {
			vote.activate();
			msg = '投票已开启';
		} else if (state === Vote.States.COOL) {
			vote.inactivate();
			msg = '投票已关闭';
		}
		res.send({
			ok: 1, msg: msg
		});
	});
	//抽奖
	/* 列出抽奖列表 */
	app.get('/do/s/lotterylist', function(req, res){
		var spkid = req.session['speakerId'],
			lectid = lectureTaffy({
				spkid: spkid
			}).first().id,
			lotteryList = lotteryTaffy({
				lectid: lectid
			}).get();
		res.send({
			ok : 1, lotteryList : lotteryList
		});
	});
	/* 查看抽奖 */
	app.get('/do/s/viewlottery', function(req, res){
		var spkid = req.session['speakerId'],
			lectid = lectureTaffy({
				spkid: spkid
			}).first().id,
			lyid = parseInt(req.query['lyid']),
            audienceList = audienceTaffy({
                lectid: lectid
            }).get(),
			lottery = lotteryTaffy({
				lectid: lectid,
				id: lyid
			}).first();
		if (! lottery) return res.send({ msg: '抽奖不存在' });
		res.send({
			ok : 1, audienceList : audienceList , lottery : lottery
		});
	});
	/* 添加抽奖 */
	app.post('/do/s/addlottery',function(req, res){
		var spkid = req.session['speakerId'],
			content = req.body['content'],
			num = parseInt(req.body['num']) || 0;
		if (! content) return res.send({ msg : '奖项详情不能为空' });
		if (num < 1) return res.send({ msg : '获奖名额应大于零' });
		var lect = lectureTaffy({
				spkid: spkid
			}).first(),
			lotteryId = lotteryTaffy.nextId ++,
			lottery = new Lottery(lotteryId, content, num);
		lotteryTaffy.insert(lottery);
		//绑定lottery和lecture
		lect.addLottery(lottery);
		res.send({
			ok : 1, msg : '添加成功'
		});
	});
	/* 删除抽奖 */
	app.get('/do/s/dellottery',function(req, res){
		var spkid = req.session['speakerId'],
			lectid = lectureTaffy({
				spkid: spkid
			}).first().id,
			lyid = parseInt(req.query['lyid']),
			lotteryP = lotteryTaffy({
				id: lyid,
				lectid: lectid
			});
		if (! lotteryP.first()) return res.send({ msg: '抽奖不存在' });
		lotteryP.remove();
		res.send({
			ok: 1, msg: '删除成功'
		});
	});
	/* 开启抽奖 */
	app.get('/do/s/startlottery',function(req, res){
		var spkid = req.session['speakerId'],
			lectid = lectureTaffy({
				spkid: spkid
			}).first().id,
			lyid = parseInt(req.query['lyid']),
			state = req.query['state'],
			lottery = lotteryTaffy({
				id: lyid,
				lectid: lectid
			}).first();

		if (! lottery) return res.send({ msg: '抽奖不存在' });
		if (lottery.state === Lottery.States.ACTIVE)
			return res.send({ msg: '抽奖已结束' });
		var audienceList = audienceTaffy({
				lectid: lectid
			}).get(),
			lotteryList = lotteryTaffy({
				lectid: lectid
			}).get(),
			acceptedList = _.reduce(lotteryList, function(memo, lottery){
				return memo.concat(lottery.awlist);
			}, []),
			diffList = _.difference(audienceList, acceptedList);
		if (diffList.length < lottery.num)
			return res.send({ msg: '听众数量不足' });
		lottery.activate();
		lottery.takeOut(diffList);
		res.send({
			ok: 1, msg: '抽奖已开启'
		});
	});

	/* 改变提问状态 */
	app.get('/do/s/setqna',function(req, res){
		var spkid = req.session['speakerId'],
			lect = lectureTaffy({
				spkid: spkid
			}).first(),
			state = req.query['state'];
		if (! _.contains(Lecture.QnaStates, state))
			return res.send({ msg: '状态不合法' });
		var msg = '';
		if (state === Lecture.QnaStates.OPEN) {
			lect.openQna();
			msg = '提问环节已开启';
		} else if (state === Lecture.QnaStates.CLOSE) {
			lect.closeQna();
			msg = '提问环节已关闭';
		}
		res.send({
			ok: 1, msg: msg
		});
	});
	/* 获得提问状态 */
	app.get('/do/s/getqna',function(req, res){
		var spkid = req.session['speakerId'],
			lect = lectureTaffy({
				spkid: spkid
			}).first();
		res.send({
			ok: 1, state: lect.qnaState
		});
	});

	/* 获取个人信息 */
	app.get('/do/s/me', function(req, res){
		var spkid = req.session['speakerId'],
			speaker = spkid && speakerTaffy({
				id: spkid
			}).first();
		if (! speaker) return res.send({ ok: 0 });
		var lectid = speaker.id,
			lectkey = lectureTaffy({
				id: lectid
			}).first().key;
		res.send({
			'ok': 1,
			'lectid': lectid,
			'lectkey': lectkey,
			'spkid': spkid,
			'spkname': speaker.name
		});
	});
}