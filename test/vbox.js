#!/usr/bin/env node
var readline = require('readline'),
	_ = require('underscore'),
	async = require('async'),
	request = require('request'),
	colors = require('colors'),
	rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	}),
	hostUrl = 'http://127.0.0.1:3088',
	actions = {
		'list': list,
		'refresh': refresh,
		'join': join,
        'ask':ask,
        'vote':vote
	},
	jars = {},
	lectkey = process.argv[2];

request = request.defaults({
	json: true
});
colors.setTheme({
	silly: 'rainbow', input: 'grey', verbose: 'cyan',
	prompt: 'grey', info: 'green', data: 'grey',
	help: 'cyan', warn: 'yellow', debug: 'blue',
	error: 'red'
});

rl.setPrompt('');
loop();

function join(audiname, callback){
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
		callback(null);
	});
}
function refresh(callback){
	var count = 0;
	async.map(_.pairs(jars), function(pair, callback){
		var name = pair[0], jar = pair[1];
		request({
			method: 'get',
			url: hostUrl + '/do/a/heartbeat',
			jar: jar
		}, function(err, res, obj){
			if (! obj['ok']) {
				delete jars[name];
				console.log(colors.debug('removed: ' + name));
				count ++;
			}
			callback(null);
		});
	}, function(err, results){
		console.log(colors.debug('Remove Count: ' + count));
		callback(null);
	});
}
function list(callback){
	var names = _.keys(jars);
	if (names.length) {
		console.log(colors.debug(_.keys(jars).join('   ')));
	}
	console.log(colors.debug('List Count: ' + names.length));
	callback(null);
}
function loop(){
	rl.question('Cmd: ', function(line){
		var cmd = getCmd(line);
		if (_.has(actions, cmd)) {
			var args = getParams(line).concat(loop);	// as callback
			actions[cmd].apply(null, args);
		} else {
			console.log(colors.error('No such cmd'));
			loop();
		}
	});
}
function ask(audiname, text, callback){
    if (!_.has(jars, audiname)) {
        console.log('听众不存在');
        return ;
    }
    request({
        url: hostUrl + '/do/a/sendmsg',
        method: 'post',
        form: {
            text: text
        },
        jar: jars[audiname]
    }, function(err, res, obj){
        handleRes.apply(null, arguments);
        callback(null);
    });

}

function vote(audiname, vid, option, callback){
    if (!_.has(jars, audiname)) {
        console.log('听众不存在');
        return ;
    }
    request({
        url: hostUrl + '/do/a/vote?vid=' + vid,
        method: 'get',
        qs: {
            option: option
        },
        jar: jars[audiname]
    }, function(err, res, obj){
        handleRes.apply(null, arguments);
        callback(null);
    });
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