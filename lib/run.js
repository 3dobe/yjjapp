
var fs = require('fs'),
	_ = require('underscore'),
	Chance = require('chance'),
	chance = new Chance();

module.exports = function(app, config) {
	// 通用操作

	/*验证码 */
	app.get('/do/valicode', function(req, res) {
		var action = req.query['action'],
			num1 = Math.floor(Math.random() * 5) + 5,	// 5~9
			num2 = Math.floor(Math.random() * 5) + 1,	// 1~5
			r = Math.floor(Math.random() * 3),
			oper = ['＋', '－', '×'][r],
			result = [num1 + num2, num1 - num2, num1 * num2][r];
		// 确保 session['valisum'] 存在
		req.session['valisum'] = req.session['valisum'] || {};
		req.session['valisum'][action] = result;
		res.send({
			num1: num1, num2: num2, oper: oper
		});
	});
	
	// 讲端操作
	app.post('/do/s/open', function(req, res) {
		var action = 'open',
			result = Number(req.body["valisum"]);
		// 确保 session['valisum'] 存在
		req.session['valisum'] = req.session['valisum'] || {};
		if (req.session["valisum"][action] === result) {
			res.send({
				ok : 1,
				msg : "成功了,yoyoyo"
			});
		} else {
			res.send({
				ok : 0,
				msg : "失败了,heyheyhey"
			});
		}
		delete req.session['valisum'][action];	// 使用后废除
	});

	/*上传文件*/
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

    /*读取文件列表*/
    app.get('/do/s/filelist',function(req,res){
        var shareDir = config.shareDir,
            resObj ={
                ok : 1,
                fileList : [ ]
            };

        fs.readdir(shareDir, function(err,files){
            _.each(files,function(val, i) {
               resObj.fileList.push({
                   name: val,
                   size: fs.statSync(shareDir+ "/"+val).size
               })
            });


            res.send(resObj);
        });
    });
	
	/*重置密码*/
	app.post('/do/s/repwd', function(req, res) {
		
	});
	app.get('/do/s/view', function(req, res) {
		
	});

	
	
	// 听端操作
	app.post('/do/a/join', function(req, res) {
		
	});
	app.get('/do/a/view', function(req, res) {
		
	});
}
