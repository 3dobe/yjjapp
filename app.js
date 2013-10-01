
var http = require('http'),
	fs = require('fs'),
	assert = require('assert'),
	express = require('express'),
	mode = 'local', // 运行模式
	config = (function() {
		var configFile = __dirname + '/config/' + mode + '.js';
		// 确保配置文件存在
		assert(fs.existsSync(configFile), 'Config file not found');
		return require(configFile);
	})(),
	app = express();

app.configure(function() {
	app.set('env', config.env);
	// 确保目录存在
	fs.existsSync(config.tmpDir) || fs.mkdirSync(config.tmpDir);
	fs.existsSync(config.shareDir) || fs.mkdirSync(config.shareDir);
	
	app.use(express.favicon());
	app.use(express.bodyParser({uploadDir: config.tmpDir}));
	app.use(express.cookieParser());
	app.use(express.session({secret: config.secret}));
});

require('./run')(app, config);
app.use(express.static(config.publicDir));
http.createServer(app).on('error', function(err) {
	assert(! err, 'Port ' + config.port + ' occupied');
}).listen(config.port, function() {
	console.log('Listening on port ' + config.port);
});
