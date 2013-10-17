
var path = require('path'),
    fs = require('fs'),
	_ = require('underscore'),
    mime = require('mime'),
	taffy = require('taffydb').taffy,
    speakerList = taffy([]),
    lectureList = taffy([]),
    audienceList = taffy([]),
    fileList = taffy([]);

module.exports = function(app, config) {
    app.set('speakerList', speakerList);
    app.set('lectureList', lectureList);
    app.set('audienceList', audienceList);
    app.set('fileList', fileList);

    require('./u')(app, config);    // 通用模块
    require('./s')(app, config);    // 讲端模块
    require('./a')(app, config);    // 听端模块
}



