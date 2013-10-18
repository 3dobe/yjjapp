
var path = require('path'),
    fs = require('fs'),
    _ = require('underscore'),
    removeDir = require('./remove-dir'),
    Speaker = require('./speaker'),
    Lecture = require('./lecture'),
    maxSizeMB = 3,  // 3M
    maxSize = maxSizeMB * 1024 * 1024;

module.exports = function(app, config) {
    var speakerList = app.get('speakerList'),
        lectureList = app.get('lectureList'),
        audienceList = app.get('audienceList'),
        fileList = app.get('fileList'),
        messageList = app.get('messageList');

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
            speaker = new Speaker(spkid, '讲者' + spkid),
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

    /* 讲座基本信息 */
    app.get('/do/s/view', function(req, res) {
        var spkid = req.session['speakerId'],
            speaker = speakerList({
                id: spkid
            }).first(),
            lecture = lectureList({
                spkid: spkid
            }).first();
        res.send({
            ok : 1,
            lectname: lecture.name,
            lectkey: lecture.key,
            spkname: speaker.name
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
            filesize = fs.statSync(fileTmpPath).size;
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
        if (fileList({
            lectid: lectid,
            name: filename
        }).first()) {   // 文件已存在
            res.send({
                ok: 0,
                msg: '文件已存在'
            });
            return;
        }
        // 转移文件
        var dir = path.join(config.shareDir, ''+lectid),    // path.join 参数必须是字符串
            filepath = path.join(dir, filename);
        fs.rename(fileTmpPath, filepath, function() {
            var newFile = {
                id: fileList({}).count() + 1,
                name: filename,
                size: filesize,
                timesDown: 0,
                lectid: lectid
            }
            fileList.insert(newFile);
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
            }).first().id,
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

    /* 讲端听众列表*/
    app.get('/do/s/audiencelist', function(req, res){
        var spkid = req.session['speakerId'],
            lectid = lectureList({
                spkid: spkid
            }).first().id,
            alist = _.reduce(audienceList({
                lectid: lectid
            }).get(), function(memo, audience) {
                memo.push(_.omit(audience, 'lectid'));
                return memo;
            },[]);
        res.send({
            ok : 1,
            audiencelist : alist
        })
    });

    /* 消息列表*/
    app.get('/do/s/msglist', function(req, res){
        var spkid = req.session['speakerId'],
            lectid = lectureList({
                spkid: spkid
            }).first().id,
            msglist = _.reduce(messageList({
                lectid: lectid
            }).get(), function(memo, message) {
                var msg = _.omit(msg, 'lectid'),
                    audiname = audienceList({
                        id: msg.audiId
                    }).first().name;
                msg.audienceName = audiname;
                memo.push(_.omit(msg, 'audiId'));
                return memo;
            }, []);
        res.send({
            ok : 1,
            msglist : msglist
        });
    });

    /* 听端退出 */
    app.get('/do/s/close', function(req, res) {
        var speakerId = req.session['speakerId'],
            speaker = speakerList({
                id: speakerId
            }).first(),
            lecture = lectureList({
                spkid: speaker.lectid
            }).first();
        if (! speaker || ! lecture) {
            res.send({
                'ok': 0,
                'msg': '你没有讲座'
            });
            return;
        }
        delete req.session['speakerId'];
        speakerList({
            id: speaker.id
        }).remove();
        lectureList({
            id: lecture.id
        }).remove();
        var dir = path.join(config.shareDir, ''+lecture.id);
        removeDir(dir);
        res.send({
            'ok': 1,
            'msg': '讲座成功关闭'
        });
    });


}