
var Chance = require('chance'),
    chance = new Chance();

function generatekey(num){
    var str = '';
    for(var i=0;i<5;i++){
        str = str + String.fromCharCode(97 + i);
    }
    for(var j=0;j<9;j++){
        str = str + j;
    }
    return chance.string({length : num, pool : str});

}
module.exports = generatekey;
