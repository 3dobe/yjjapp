
var _ = require('underscore'),
	rootDir = __dirname + '/..',
	tmpDir = rootDir,
	publicDir = rootDir + '/public',
	shareDir = publicDir + '/files';

module.exports = function(mode) {
	var config = {
		rootDir: rootDir,
		tmpDir: tmpDir,
		publicDir: publicDir,
		shareDir: shareDir,
		timezoneOffset: 8,
		secret: '308'
	}
	// 确保配置文件存在
	try {
		_.extend(config, require('./' + mode));
	} catch (err) {
		throw new Error('Config file not found');
	}
	return config;
}
