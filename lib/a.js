
var path = require('path'),
    _ = require('underscore'),
    taffy = require('taffydb').taffy,
    Audience = require('./Audience'),
    audienceList = taffy([]);

module.exports = function(app, config) {
    var lectureList = app.get('lectureList'),
        fileList = app.get('fileList');

    //听端操作
    /*加入讲座*/
    app.get('/do/a/join', function(req, res){
        var key = req.query['key'],
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

    /* 听端基本信息*/
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

    /* 听端文件列表*/
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

    /* 听端听众列表*/
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