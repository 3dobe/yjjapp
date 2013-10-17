
var generatekey = require('./generatekey');

function Lecture(id, name, spkid, pwd){
    this.id = id;
    this.name = name;
    this.spkid = spkid;
    this.pwd = pwd;
    this.key = this.makeKey();
}

Lecture.prototype.addAudi = function(audience){
   audience.lectid = this.id;
}

Lecture.prototype.getAudi = function(){

}

Lecture.prototype.makeKey = function(){
    return generatekey(6);
}

module.exports = Lecture;
