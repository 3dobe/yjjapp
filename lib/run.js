
var path = require('path'),
    fs = require('fs'),
	_ = require('underscore'),
	taffy = require('taffydb').taffy,
    speakerList = taffy([]),
    lectureList = taffy([]),
    audienceList = taffy([]),
    fileList = taffy([]),
    messageList = taffy([]);

speakerList.nextId = 1;
lectureList.nextId = 1;
audienceList.nextId = 1;
fileList.nextId = 1;
messageList.nextId = 1;

module.exports = function(app, config) {
    app.set('speakerList', speakerList);
    app.set('lectureList', lectureList);
    app.set('audienceList', audienceList);
    app.set('fileList', fileList);
    app.set('messageList', messageList);

    require('./u')(app, config);    // 通用模块
    require('./s')(app, config);    // 讲端模块
    require('./a')(app, config);    // 听端模块
}



