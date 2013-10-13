
var VCODES = 'vcodes';

module.exports = function(req, res, next) {
    req.session[VCODES] = req.session[VCODES] || {};
    req.makeVcode = makeVcode;
    req.validVcode = validVcode;
    next();
}

function makeVcode(action) {
    var vcodes = this.session[VCODES],
        num1 = Math.floor(Math.random() * 5) + 5,	// 5~9
        num2 = Math.floor(Math.random() * 5) + 1,	// 1~5
        r = Math.floor(Math.random() * 3),
        oper = ['＋', '－', '×'][r],
        result = [num1 + num2, num1 - num2, num1 * num2][r];
    vcodes[action] = result;
    return {
        num1: num1, num2: num2, oper: oper
    }
}
function validVcode(action, vcode) {
    var vcodes = this.session[VCODES],
        pass = action in vcodes
        && vcodes[action] === parseInt(vcode);
    delete vcodes[action];
    return pass;
}