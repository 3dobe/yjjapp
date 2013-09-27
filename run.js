
var yjj = require('./lib/yjj');

module.exports = function(app) {
    // 通用操作
    app.all('/do/valicode', function(req, res) {
        /*var action = req.body['action'];
        var session = req.session;
        var num1 = Math.floor(Math.random() * 9) + 1,
            num2 = Math.floor(Math.random() * 9) + 1,
            r = Math.floor(Math.random() * 3),
            oper = ['＋', '－', '×'][r],
            result = [num1 + num2, num1 - num2, num1 * num2][r];
        req.session['valicode'][action] = result;
        res.send({
            num1: num1,
            num2: num2,
            oper: oper
        });*/
    });

	// 讲端操作
	app.all('/do/s/open', function(req, res) {
       /*  req.session['valicode']['open']
        req.body['vali']
        res.send({
            ok: 1,
            msg: ''
        });             */
	});
	app.all('/do/s/repwd', function(req, res) {
		
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
