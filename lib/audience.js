
function Audience(id, name){
	this.id = id;
	this.name = name;
    this.lectid = undefined;
    this.jointime = Date.now();
    this.hit = this.jointime;
}

module.exports = Audience;