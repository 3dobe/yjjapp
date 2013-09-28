var ctx;

function drawVerificationCode(firstArg,secondArg,operator){
    ctx = document.getElementById('canvas').getContext('2d');
    ctx.font = "15px Handwriting";

    ctx.background = "rgb(0.255.255)";
    ctx.clearRect(0, 0, 70, 20);
    ctx.fillText(firstArg + operator + secondArg + "= ?" ,10,15);

}
