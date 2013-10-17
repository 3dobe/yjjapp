
function Speaker(id, name){
    this.id = id;
    this.name = name;
    this.lectid = undefined;
}

Speaker.prototype.createLecture = function(lecture){
    this.lectid = lecture.id;
}

module.exports = Speaker;