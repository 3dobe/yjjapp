
var taffy = require('taffydb').taffy,
	my = require('./lib/my'),
	speechList = taffy([]),
	bitsSpeechUID = 4, bitsSpeechPwd = 6;

module.exports = function(app) {
	// 讲端操作
	app.get('/do/s/open', function(req, res) {
		var uid = (function() {
			var uid = my.getUID(bitsSpeechUID);
			while (speechList({uid: uid}).count() > 0) {	// 避免 uid 重复
				uid = my.getUID(bitsSpeechUID);
			}
			return uid;
		})(), newSpeech = {
			uid: uid,
			password: my.getUID(bitsSpeechPwd)
		}
		speechList.insert(newSpeech);
		
		req.session.s = {
			uid: newSpeech.uid
		}
		res.send({
			uid: newSpeech.uid,
			password: newSpeech.password
		});
	});
	app.get('/do/s/reset_pwd', function(req, res) {
		
	});
	app.get('/do/s/enter', function(req, res) {
		
	});
	app.get('/do/s/view', function(req, res) {
		
	});
	
	// 听端操作
	app.get('/do/a/join', function(req, res) {
		
	});
	app.get('/do/a/view', function(req, res) {
		
	});
}
