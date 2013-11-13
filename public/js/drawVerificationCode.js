$.fn.drawVerificationCode = function(firstArg, secondArg, operator){
    var ctx;
    ctx = this[0].getContext('2d');
    ctx.font = "15px Arial";
    ctx.clearRect(0, 0, 70, 18);
    ctx.fillText(firstArg + operator + secondArg + "＝?" , 7, 15);

}
