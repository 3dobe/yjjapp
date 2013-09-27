
var _ = require('underscore'),
	yjj = require('../lib/yjj'),
	bits = 4;

_.times(10, function() {
	console.log(yjj.getRandomCode(bits), 36);
});
