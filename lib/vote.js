
function Vote(id, content, options) {
    this.id = id;
    this.content = content;
    this.options = options;
    this.lectid = undefined;
    this.createtime = Date.now();
    this.state = Vote.States.COOL;
}
Vote.States = {
    COOL: 'cool',
    ACTIVE: 'active'
}

Vote.prototype.activate = function() {
    this.state = Vote.States.ACTIVE;
}
Vote.prototype.inactivate = function() {
    this.state = Vote.States.COOL;
}

module.exports = Vote;
