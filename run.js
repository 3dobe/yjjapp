
var fs = require('fs'),
	yjj = require('./lib/yjj');

module.exports = function(app, config) {
	// 通用操作
	app.all('/do/valicode', function(req, res) {
		var action = req.query['action'];
		var session = req.session;
		var num1 = Math.floor(Math.random() * 5) + 5,	// 5~9
			num2 = Math.floor(Math.random() * 5) + 1;	// 1~5
		
		var r = Math.floor(Math.random() * 3),
			oper = ['＋', '－', '×'][r],
			result = [num1 + num2, num1 - num2, num1 * num2][r];
		req.session['valisum'] = req.session['valisum'] || {};
		req.session['valisum'][action] = result;
		res.send({
			num1: num1,
			num2: num2,
			oper: oper
		});
	});
	
	// 讲端操作
	/*验证码 */
	app.all('/do/s/open', function(req, res) {
		var action = 'open';
		var result = Number(req.body["valisum"]);
		if(req.session["valisum"] && req.session["valisum"][action] === result){
			res.send({
				ok : 1,
				msg : "成功了,yoyoyo"
			});
		   }
		else{
			res.send({
				ok : 0,
				msg : "失败了,heyheyhey"
			});
		}
		if(req.session['valisum']){
			delete req.session['valisum'][action];
		}
	
	});
	/*上传文件*/
	app.all('/do/s/savefile',function(req,res){
		var file = req.files && req.files['file'];
		if (file) {
			fs.rename(file.path, config.shareDir + '/' + file.originalFilename);
		} else {

		}
		res.send({
			ok : 1,
			msg : "yoyoyo"
		});
	});

	/*重置密码*/
	app.all('/do/s/repwd', function(req, res) {
		
	});


	app.all('/do/s/enter', function(req, res) {
		
	});
	app.all('/do/s/view', function(req, res) {
		
	});
	
	// 听端操作
	app.all('/do/a/join', function(req, res) {
		
	});
	app.all('/do/a/view', function(req, res) {
		
	});
}
