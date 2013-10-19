
var path = require('path'),
	rootDir = path.join(__dirname, '..'),
	publicDir = path.join(rootDir, 'public'),
	contentDir = path.join(rootDir, '..', 'content'),
	tmpDir = path.join(contentDir, 'tmp'),
	shareDir = path.join(contentDir, 'files');

module.exports = {
	env: 'production',
	port: process.env.APP_PORT,
	contentDir: contentDir,
	tmpDir: tmpDir,
	shareDir: shareDir
}
