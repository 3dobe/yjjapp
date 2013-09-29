
var _ = require('underscore');

_.times(20, function(i) {
    var num1 = Math.floor(Math.random() * 5) + 5,
        num2 = Math.floor(Math.random() * 5) + 1;
    console.log(num1, num2);
});