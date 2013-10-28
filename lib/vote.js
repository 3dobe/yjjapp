
var _ = require('underscore');

function Vote(id, content, options) {
    this.id = id;
    this.content = content;
    this.options = _.reduce(options, function(memo, word){
        memo[word] = 0;
        return memo;
    }, {});
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
Vote.prototype.addOne = function(word){
    this.options[word]++;
}

module.exports = Vote;
