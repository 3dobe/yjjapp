
var rootDir = __dirname + '/..';

module.exports = {
	env: 'production',
	port: 3088,
	timezoneOffset: 8,
	secret: '' + Math.random(),
	rootDir: rootDir,
	tmpDir: rootDir,
	publicDir: rootDir + '/public'
}