
function Speaker(id, name){
    this.id = id;
    this.name = name;
    this.lectId = undefined;
}

Speaker.prototype.createLecture = function(lecture){
    this.lectId = lecture.id;
}

module.exports = Speaker;