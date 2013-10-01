
var Client = require('../lib/client'),
	client = new Client('localhost:3088');

client.get('/do/valicode', {
	'action': 'open'
}, {}, function(err, res, resTxt) {
	console.log('验证码为: ' + resTxt);
	var resObj = JSON.parse(resTxt),
	num1 = resObj['num1'],
	num2 = resObj['num2'],
	oper = resObj['oper'],
	result = {
		'＋': num1 + num2,
		'－': num1 - num2,
		'×': num1 * num2
	}[oper];
	console.log('运算结果为: '+ result);
	
	client.post('/do/s/open', {
		'valisum': result
	}, {}, function(err, res, resTxt) {
		var resObj = JSON.parse(resTxt);
		console.log(resObj);
	});
});
