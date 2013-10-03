
var rootDir = __dirname + '/..',
    publicDir = rootDir + '/public',
    shareDir = publicDir + '/files';

module.exports = {
	env: 'production',
	port: 3088,
	timezoneOffset: 8,
	secret: '' + Math.random(),
	rootDir: rootDir,
	tmpDir: rootDir,
	publicDir: publicDir,
    shareDir: shareDir
}