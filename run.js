
var taffy = require('taffydb').taffy,
	sys = require('./lib/sys'),
	lectureList = taffy([]),
	bitsLectureID = 4, bitsLecturePwd = 6;

module.exports = function(app) {
	// 讲端操作
	app.get('/do/s/open', function(req, res) {
		var id = (function() {
			var uid = sys.getUID(bitsLectureID);
			while (lectureList({id: uid}).count() > 0) {	// 避免 id 重复
				uid = sys.getUID(bitsLectureID);
			}
			return uid;
		})(), newLecture = {
			id: id,
			password: sys.getUID(bitsLecturePwd)
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
