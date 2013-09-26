
var http = require('http'),
    fs = require('fs'),
    assert = require('assert'),
	express = require('express'),
	mkdirp = require('mkdirp'),
    mode = 'local',// 运行模式
    config = (function() {
        var configFile = './config/' + mode + '.js';
        // 确保配置文件存在
        assert(fs.existsSync(configFile), 'Config file not found');
        return require(configFile);
    })(),
    app = express();

app.configure(function() {
	app.set('env', config.env);
	mkdirp.sync(config.tmpDir);     // 确保临时文件夹存在
	app.use(express.favicon());
	app.use(express.bodyParser({uploadDir: config.tmpDir}));
	app.use(express.cookieParser());
	app.use(express.session({secret: config.secret}));
});

require('./run')(app);
app.use(express.static(config.publicDir));
http.createServer(app).listen(config.port, function() {
	console.log('Server running on ' + config.port);
});
