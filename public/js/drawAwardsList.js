$.fn.takeoutAwardsList = function(audilist, awlist, callback){
    var ctx,
        dtime = 70,
        times = 50,
        i = 0;
    ctx = this[0].getContext('2d');
    ctx.font = "15px Arial";
    draw();
    function draw(){
        if(i==times){
            ctx.clearRect(0, 0, 350, 350);
            var awname = _.sample(awlist).name;
            ctx.fillText("得奖人 : " + awname ,7,15);
            return callback();
        }else{
            var name = _.sample(audilist).name;
            ctx.clearRect(0, 0, 350, 350);
            ctx.fillText("得奖人 : " + name ,7,15);
            i++;
            setTimeout(draw,dtime);
        }
    }

}

$.fn.drawAwardsList = function(awlist){
    var ctx;
    ctx = this[0].getContext('2d');
    ctx.font = "15px Arial";
    ctx.clearRect(0, 0, 350, 350);
    var name = _.sample(awlist).name;
    ctx.fillText("得奖人 : " + name , 7, 15);
}