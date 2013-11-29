
var _ = require('underscore');

function Vote(id, content, words) {
    this.id = id;
    this.content = content;
    this.options = _.reduce(words, function(memo, word){
        memo.push({
            word : word,
            count : 0
        });
        return memo;
    }, []);
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
Vote.prototype.addOne = function(index){
    this.options[index].count++;
}

module.exports = Vote;
