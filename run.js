
var fs = require('fs'),
	_ = require('underscore'),
	Chance = require('chance'),
	chance = new Chance();

module.exports = function(app, config) {
	// 通用操作
	/*验证码 */
	app.all('/do/valicode', function(req, res) {
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
	app.all('/do/s/open', function(req, res) {
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
	app.all('/do/s/savefile',function(req,res){
		var file = req.files && req.files['file'];
		if (file) {
			fs.rename(file.path, config.shareDir + '/' + file.originalFilename);
			res.send({
				ok : 1,
				msg : "yoyoyo"
			});
		} else {
			res.send({
				ok : 0,
				msg : "没有文件"
			});
		}
	});
	
	/*重置密码*/
	app.all('/do/s/repwd', function(req, res) {
		
	});
	app.all('/do/s/view', function(req, res) {
		
	});
	app.all('/do/s/filelist', function(req, res) {
		/* 测试 */
		var fileList = [];
		_.times(chance.integer({
			min: 3, max: 7
		}), function(i) {
			var file = {
				name: chance.word() + '.' + chance.string({
					pool: 'abcdefghijklmnopqrstuvwxyz',
					length: 2
				}),
				size: chance.integer({
					min: 1024, max: 1048576	// kb
				}),
				description: chance.sentence({
					words: 4
				}),
				timesDown: chance.integer({
					min: 0, max: 30
				})
			}
			fileList.push(file);
		});
		res.send({
			ok: 1,
			fileList: fileList
		});
	});
	
	
	// 听端操作
	app.all('/do/a/join', function(req, res) {
		
	});
	app.all('/do/a/view', function(req, res) {
		
	});
}
