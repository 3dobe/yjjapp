
var _ = require('underscore'),
	my = module.exports = {};

my.getUID = function(bits, scale) {
	scale = scale || 36;
	var hash = (function() {
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
	})(), uid = '';
	_.times(bits, function() {
		var n = Math.floor(Math.random() * scale);
		uid += hash[n];
	});
	return uid;
}
