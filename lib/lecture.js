
var generatekey = require('./generatekey');

function Lecture(id, name, spkid, pwd){
    this.id = id;
    this.name = name;
    this.spkid = spkid;
    this.pwd = pwd;
    this.key = this.makeKey();
    this.qnaState = Lecture.QnaStates.CLOSE;
}
Lecture.MAX_LEN_NAME = 32;
Lecture.MAX_LEN_PWD = 32;
Lecture.QnaStates = {
    OPEN: 'open',
    CLOSE: 'close'
}

Lecture.prototype.openQna = function(){
    this.qnaState = Lecture.QnaStates.OPEN;
}
Lecture.prototype.closeQna = function(){
    this.qnaState = Lecture.QnaStates.CLOSE;
}

Lecture.prototype.addVote = function(vote){
    vote.lectid = this.id;
}

Lecture.prototype.addLottery = function(lottery){
    lottery.lectid = this.id;
}

Lecture.prototype.addAudi = function(audience){
   audience.lectid = this.id;
}
Lecture.prototype.makeKey = function(){
    return generatekey(6);
}

module.exports = Lecture;
