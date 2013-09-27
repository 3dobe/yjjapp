
var _ = require('underscore'),
    taffy = require('taffydb').taffy,
	yjj = module.exports = {},
    lectureList = taffy([]),
    bitsLectureID = 4, scaleLectureID = 36,
    bitsLecturePwd = 6, scaleLecturePwd = 36;

// 根据位数和进制数产生随机码
yjj.getRandomCode = function(bits, scale) {
	scale = scale || 36;
	var hash = (function() {	// array of [0-9,a-z,A-Z]
		var arr = [];
		_.times(10, function(i) {
			arr.push('' + i);
		});
		_.times(26, function(i) {
			arr.push(String.fromCharCode(i + 97));
		});
		_.times(26, function(i) {
			arr.push(String.fromCharCode(i + 65));
		});
		return arr;
	})(), code = '';
	_.times(bits, function() {
		var n = Math.floor(Math.random() * scale);
		code += hash[n];
	});
	return code;
}

// 开辟讲座
yjj.openLecture = function() {
    var id = (function() {
        var code = yjj.getRandomCode(bitsLectureID, scaleLectureID);
        while (lectureList({id: code}).count() > 0) {	// 避免 id 重复
            code = yjj.getRandomCode(bitsLectureID, scaleLectureID);
        }
        return code;
    })(), newLecture = {
        id: id,
        password: yjj.getRandomCode(bitsLecturePwd, scaleLecturePwd)
    }
    lectureList.insert(newLecture);
    return newLecture;
}
