
var _ = require('underscore'),
	sys = require('../lib/sys'),
	bits = 4;

_.times(10, function() {
	console.log(sys.getUID(bits));
});
