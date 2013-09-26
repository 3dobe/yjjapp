
var taffy = require('taffydb').taffy,
	sys = require('./lib/sys'),
	lectureList = taffy([]),
	bitsLectureID = 4, bitsLecturePwd = 6;

module.exports = function(app) {
	// 讲端操作
	app.all('/do/s/open', function(req, res) {
		var id = (function() {
			var uid = sys.allUID(bitsLectureID);
			while (lectureList({id: uid}).count() > 0) {	// 避免 id 重复
				uid = sys.allUID(bitsLectureID);
			}
			return uid;
		})(), newLecture = {
			id: id,
			password: sys.allUID(bitsLecturePwd)
		}
		lectureList.insert(newLecture);
		
		req.session.s = {
			id: newLecture.id
		}
		res.send({
			id: newLecture.id,
			password: newLecture.password
		});
	});
	app.all('/do/s/reset_pwd', function(req, res) {
		
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
