var _ = require('underscore');

function Lottery(id, content, num, awlist) {
    this.id = id;
    this.content = content;
    this.num = num;
    this.lectid = undefined;
    this.awlist = undefined;
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


Lottery.prototype.takeOut = function(list){
    var awlist;
    awlist = _.sample(list, this.num);
    this.setAwlist(awlist);
    return awlist;
}
Lottery.prototype.setAwlist = function(awlist){
    this.awlist = awlist;
}

module.exports = Lottery;

