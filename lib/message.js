
function Message(id, lectid, audiId, text){
    this.id = id;
    this.lectid = lectid;
    this.audiId = audiId;
    this.text = text;
    this.sendtime = Date.now();
}


module.exports = Message;