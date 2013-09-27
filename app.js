
var http = require('http'),
	fs = require('fs'),
	assert = require('assert'),
	express = require('express'),
	mkdirp = require('mkdirp'),
	mode = 'local', // 运行模式
	config = (function() {
		var configFile = __dirname + '/config/' + mode + '.js';
		// 确保配置文件存在
		assert(fs.existsSync(configFile), '配置文件不存在');
		return require(configFile);
	})(),
	app = express();

app.configure(function() {
	app.set('env', config.env);
	mkdirp.sync(config.tmpDir);	 // 确保临时文件夹存在
	app.use(express.favicon());
	app.use(express.bodyParser({uploadDir: config.tmpDir}));
	app.use(express.cookieParser());
	app.use(express.session({secret: config.secret}));
});

require('./run')(app);
app.use(express.static(config.publicDir));
http.createServer(app).on('error', function(err) {
    assert(false, '服务运行失败，可能是端口' + config.port + '被占用');
}).listen(config.port, function() {
    console.log('服务成功运行于端口' + config.port);
});

