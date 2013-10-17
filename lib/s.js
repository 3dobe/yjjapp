
var path = require('path'),
    fs = require('fs'),
    _ = require('underscore'),
    taffy = require('taffydb').taffy,
    Speaker = require('./speaker'),
    Lecture = require('./lecture'),
    speakerList = taffy([]),
    maxSizeMB = 3,  // 3M
    maxSize = maxSizeMB * 1024 * 1024;

module.exports = function(app, config) {
    var lectureList = app.get('lectureList'),
        fileList = app.get('fileList');

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

    /* 讲座基本信息 */
    app.get('/do/s/view', function(req, res) {
        var spkid = req.session['speakerId'],
            lecture = lectureList({
                spkid: spkid
            }).first();


        res.send({
            ok : 1,
            name : lecture.name,
            key : lecture.key
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
            alist = audienceList({
                lectid: lectid
            }).get();
        res.send({
            ok : 1,
            audiencelist : alist
        })
    });
}