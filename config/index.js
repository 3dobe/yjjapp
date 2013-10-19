
var path = require('path'),
	_ = require('underscore'),
	rootDir = path.join(__dirname, '..'),
	publicDir = path.join(rootDir, 'public'),
	contentDir = path.join(rootDir, 'content'),
	tmpDir = path.join(contentDir, 'tmp'),
	shareDir = path.join(contentDir, 'files');

module.exports = function(mode) {
	var config = {
			rootDir: rootDir,
			publicDir: publicDir,
			contentDir: contentDir,
			tmpDir: tmpDir,
			shareDir: shareDir,
			timezoneOffset: (-60) * 8,  // BJ time
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
