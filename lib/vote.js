
function Vote(id, content,options){
    this.id = id;
    this.content = content;
    this.options = options;
    this.lectid = undefined;
    this.createtime = Date.now();
}

module.exports = Vote;
