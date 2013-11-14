$.fn.takeoutAwardsList = function(audilist, awlist, callback){
    var num = awlist.length,
        lihtml = '',
        dtime = 70,
        times = 50,
        i = 0,
        $self = $(this);

    takeout();
    function takeout(){
        if(i==times){
            for(var j=0;j<num;j++){
                lihtml += '<li class="list-group-item">' + awlist[j].name + '</li>';
            }
            $self.html(lihtml);
            lihtml = '';
            return callback();

        }else{
            for(var j=0;j<num;j++){
               lihtml += '<li class="list-group-item">' + _.sample(audilist).name +'</li>';
            }
            $self.html(lihtml);
            lihtml = '';
            i++;
            setTimeout(takeout, dtime);
        }
    }
}

$.fn.setAwardsList = function(awlist){
    var num = awlist.length,
        lihtml = '';
    for(var i=0;i<num;i++){
        lihtml += '<li class="list-group-item">' + awlist[i].name +'</li>'
    }
    $(this).html(lihtml);
    lihtml = '';
}