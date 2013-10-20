
function Audience(id, name){
	this.id = id;
	this.name = name;
    this.lectid = undefined;
    this.jointime = Date.now();
}

module.exports = Audience;