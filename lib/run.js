
var path = require('path'),
    fs = require('fs'),
	_ = require('underscore'),
	taffy = require('taffydb').taffy,
    speakerTaffy = taffy([]),
    lectureTaffy = taffy([]),
    audienceTaffy = taffy([]),
    fileTaffy = taffy([]),
    messageTaffy = taffy([]),
    voteTaffy = taffy([]),
    lotteryTaffy = taffy([]);

speakerTaffy.nextId = 1;
lectureTaffy.nextId = 1;
audienceTaffy.nextId = 1;
fileTaffy.nextId = 1;
messageTaffy.nextId = 1;
voteTaffy.nextId = 1;
lotteryTaffy.nextId = 1;

module.exports = function(app, config) {
    app.set('speakerTaffy', speakerTaffy);
    app.set('lectureTaffy', lectureTaffy);
    app.set('audienceTaffy', audienceTaffy);
    app.set('fileTaffy', fileTaffy);
    app.set('messageTaffy', messageTaffy);
    app.set('voteTaffy', voteTaffy);
    app.set('lotteryTaffy',lotteryTaffy);

    require('./u')(app, config);    // 通用模块
    require('./s')(app, config);    // 讲端模块
    require('./a')(app, config);    // 听端模块
}



