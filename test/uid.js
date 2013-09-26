
var _ = require('../lib/mylib')(require('underscore')),
	bits = 4;

_.times(10, function() {
	console.log(_.getUID(bits));
});
