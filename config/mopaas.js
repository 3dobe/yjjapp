/**
 * Created by fritz on 1/14/14.
 */
var contentDir = process.env['MOPAAS_FILESYSTEM6445_LOCAL_PATH'],
	tmpDir = path.join(contentDir, 'tmp'),
	shareDir = path.join(contentDir, 'files');

module.exports = {
	env: 'production',
	host: process.env['VMC_APP_HOST'],
	port: process.env['VMC_APP_PORT'],

	contentDir: contentDir,
	tmpDir: tmpDir,
	shareDir: shareDir
};
