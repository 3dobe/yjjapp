
var http = require('http'),
	fs = require('fs'),
	express = require('express'),
	mode = 'local', // 运行模式
	config = (function() {
		var configFile = __dirname + '/config/' + mode + '.js';
		// 确保配置文件存在
		if (! fs.existsSync(configFile)) {
			throw new Error('Config file not found');
		}
		return require(configFile);
	})(),
	run = require('./lib/run'),
	app = express();

// 确保目录存在
fs.existsSync(config.tmpDir) || fs.mkdirSync(config.tmpDir);
fs.existsSync(config.shareDir) || fs.mkdirSync(config.shareDir);

app.configure(function() {
	app.set('env', config.env);
	app.use(express.favicon());
	app.use(express.bodyParser({uploadDir: config.tmpDir}));
	app.use(express.cookieParser());
	app.use(express.session({secret: config.secret}));
	run(app, config);	// 上层运作
	app.use(express.static(config.publicDir));	// 静态资源
});

http.createServer(app).on('error', function(err) {
	throw new Error('Port ' + config.port + ' occupied');
}).listen(config.port, function() {
	console.log('Listening on port ' + config.port);
});
