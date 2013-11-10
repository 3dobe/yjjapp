var _ = require('underscore');

function Lottery(id, content, words) {
    this.id = id;
    this.content = content;
    this.options = _.reduce(words, function(memo, word){
        memo[word] = 0;
        return memo;
    }, {});
    this.lectid = undefined;
    this.createtime = Date.now();
    this.state = Lottery.States.COOL;
}

Lottery.States = {
    COOL: 'cool',
    ACTIVE: 'active'
}

Lottery.prototype.activate = function() {
    this.state = Lottery.States.ACTIVE;
}
Lottery.prototype.inactivate = function() {
    this.state = Lottery.States.COOL;
}
Lottery.prototype.addOne = function(word){
    this.options[word]++;
}
Lottery.prototype.takeOut = function(word, list){

}
module.exports = Lottery;

