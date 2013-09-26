
var http = require('http'),
	assert = require('assert'),
	express = require('express'),
	mkdirp = require('mkdirp'),
	config = require('./config/local'),
	app = express();

app.configure(function() {
	app.set('env', config.env);
	mkdirp.sync(config.tmpDir);
	
	app.use(express.favicon());
	app.use(express.bodyParser({uploadDir: config.tmpDir}));
	app.use(express.cookieParser());
	app.use(express.session({secret: config.secret}));
});

require('./run')(app);
app.use(express.static(config.publicDir));
http.createServer(app).listen(config.port, function() {
	console.log('server listening on', config.port);
});
