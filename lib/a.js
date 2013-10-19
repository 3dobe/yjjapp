
var path = require('path'),
    _ = require('underscore'),
    Audience = require('./audience'),
    Message = require('./message');

module.exports = function(app, config) {
    var speakerList = app.get('speakerList'),
        lectureList = app.get('lectureList'),
        audienceList = app.get('audienceList'),
        fileList = app.get('fileList'),
        messageList = app.get('messageList');

    // 听端操作
    /* 加入讲座 */
    app.get('/do/a/join', function(req, res){
        var isQr = !! req.query['qr'],
		key = req.query['key'],
            lect = lectureList({
                key: key
            }).first();
        if(! lect){
		isQr ? res.redirect('/a/#/join'):
		res.send({
			ok : 0,
			msg : '没有该讲座'
		});
		return ;
        }
        var audiId = audienceList({}).count() + 1,
            audience = new Audience(audiId, '听众'+audiId);
        audienceList.insert(audience);
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
            audience = audienceList({
                id : audiId
            }).first(),
            lectid = audience.lectid,
            lecture = lectureList({
                id : lectid
            }).first();

        res.send({
            ok : 1,
            audiname : audience.name,
            lectname : lecture.name,
            lectkey : lecture.key
        })
    });

    /* 听端文件列表 */
    app.get('/do/a/filelist', function(req, res){
        // 获取讲座id
        var audiId = req.session['audienceId'],
            lectid = audienceList({
                id : audiId
            }).first().lectid,
            files = _.reduce(fileList({
                lectid: lectid
            }).get(), function(memo, file) {
                memo.push(_.omit(file, 'lectid'));
                return memo;
            }, []);
        res.send({
            ok: 1,
            files: files
        });

    });

    /* 听端听众列表 */
    app.get('/do/a/audiencelist', function(req, res){
        var audiId = req.session['audienceId'],
            lectid = audienceList({
                id : audiId
            }).first().lectid,
            alist = _.reduce(audienceList({
                lectid: lectid
            }).get(), function(memo, audience) {
                memo.push(_.omit(audience,'lectid'));
                return memo;
            },[]);
        res.send({
            ok : 1,
            audienceList : alist
        })
    });

    /* 听端发送消息 */
    app.post('/do/a/sendmsg', function(req, res){
        var audiId = req.session['audienceId'],
            lectid = audienceList({
                id : audiId
            }).first().lectid,
            text = req.body['msg'],
            msg = new Message(lectid,audiId, text);
        messageList.insert(msg);
        res.send({
            ok : 1,
            msg : '成功发出'
        })
    });

    /* 消息列表 */
    app.get('/do/a/msglist', function(req, res){
        var audiId = req.session['audienceId'],
            lectid = audienceList({
                id : audiId
            }).first().lectid,
            msglist = _.reduce(messageList({
                lectid: lectid
            }).get(), function(memo, message) {
                var msg = _.omit(message,'lectid'),
                    audiname = audienceList({
                        id : msg.audiId
                    }).first().name;
                msg.audienceName = audiname;
                memo.push(_.omit(msg, 'audiId'));
                return memo;
            },[]);
        res.send({
            ok : 1,
            msgList : msglist
        })
    });

    /* 听端退出 */
    app.get('/do/a/exit', function(req, res) {
        var audienceId = req.session['audienceId'];
        audienceList({
            id: audienceId
        }).remove();
        delete req.session['audienceId'];
        res.send({
            'ok': 1,
            'msg': '退出成功'
        });
    });


}