
var http = require('http'),
	fs = require('fs'),
	_ = require('underscore'),
	express = require('express'),
	mode = 'local', // 运行模式
	config = require('./config/')(mode),
	run = require('./lib/run'),
	app = express();

// 确保目录存在
var tmpDir = config.tmpDir,
    shareDir = config.shareDir;
fs.existsSync(tmpDir) || fs.mkdirSync(tmpDir);
removeDirSync(shareDir);
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

function removeDirSync(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                removeDirSync(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}
