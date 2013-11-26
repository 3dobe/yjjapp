
function Speaker(id, name){
    this.id = id;
    this.name = name;
    this.lectid = undefined;
}
Speaker.MAX_LEN_NAME = 12;

Speaker.prototype.createLecture = function(lecture){
    this.lectid = lecture.id;
}

module.exports = Speaker;