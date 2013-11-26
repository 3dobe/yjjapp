
function Audience(id, name){
	this.id = id;
	this.name = name;
    this.lectid = undefined;
    this.jointime = Date.now();
    this.hit = this.jointime;
}
Audience.MAX_LEN_NAME = 12;

module.exports = Audience;