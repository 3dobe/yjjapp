
var http = require('http'),
	fs = require('fs'),
	_ = require('underscore'),
	express = require('express'),
	mode = (process.argv && process.argv[2]) || 'bae', // 运行模式
	config = require('./config/')(mode),
	run = require('./lib/run'),
	removeDir = require('./lib/removedir'),
	app = express();

// 确保目录存在
var contentDir = config.contentDir,
	tmpDir = config.tmpDir,
	shareDir = config.shareDir;
fs.existsSync(contentDir) || fs.mkdirSync(contentDir);
fs.existsSync(tmpDir) || fs.mkdirSync(tmpDir);
removeDir(shareDir);
fs.mkdirSync(shareDir);

app.set('env', config.env);
app.use(express.favicon());
app.use(express.bodyParser({uploadDir: config.tmpDir}));
app.use(express.cookieParser());
app.use(express.session({secret: config.secret}));
run(app, config);	// 上层运作
app.use(express.static(config.publicDir));	// 静态资源

http.createServer(app).on('error', function(err) {
	throw new Error('Port ' + config.port + ' occupied');
}).listen(config.port, function() {
	console.log('Listening on port ' + config.port);
});
