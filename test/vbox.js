#!/usr/bin/env node
var readline = require('readline'),
	_ = require('underscore'),
	request = require('request'),
	colors = require('colors'),
	rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	}),
	hostUrl = 'http://127.0.0.1:3088',
	actions = {
		'list': list,
		'join': join

	},
	jars = {},
	lectkey = process.argv[2];

rl.setPrompt('');
request = request.defaults({
	json: true
});
colors.setTheme({
	silly: 'rainbow', input: 'grey', verbose: 'cyan',
	prompt: 'grey', info: 'green', data: 'grey',
	help: 'cyan', warn: 'yellow', debug: 'blue',
	error: 'red'
});

rl.on('line', function(line){
	var cmd = getCmd(line),
		params = getParams(line);
	if (_.has(actions, cmd)) {
		actions[cmd].apply(null, params);
	} else {
		console.log(colors.error('No such cmd'));
	}
});

function join(audiname){
	var jar = request.jar();
	request({
		url: hostUrl + '/do/a/join',
		method: 'get',
		qs: {
			key: lectkey,
			nick: audiname
		},
		jar: jar
	}, function(err, res, obj){
		handleRes.apply(null, arguments);
		if (obj['ok']) {
			jars[audiname] = jar;
		}
	});
}
function list(){
	var names = _.keys(jars);
	console.log(colors.debug('Count: ' + names.length));
	if (names.length) {
		console.log(colors.debug(_.keys(jars).join('   ')));
	}
}

function handleRes(err, res, obj){
	var ok = obj['ok'],
		color = colors[ok ? 'info' : 'warn'];
	console.log(color(JSON.stringify(obj)));
}
function getCmd(line){
	var mat = line.match(/^(\S+)/);
	return mat && mat[1];
}
function getParams(line){
	var params = line.split(' ').slice(1);
	return params;
}