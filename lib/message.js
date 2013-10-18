
function Message(lectid, audiId, text){
    this.lectid = lectid;
    this.audiId = audiId;
    this.text = text;
    this.sendtime = Date.now();
}


module.exports = Message;