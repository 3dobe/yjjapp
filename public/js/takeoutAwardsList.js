$.fn.takeoutAwardsList = function(audilist, awlist, callback){
	var num = awlist.length,
		ulhtml = '',
		dtime = 70,
		times = 50,
		i = 0,
        colors = ['#00CC00','#0099FF','#3333FF','#6600CC','#66FFFF','#9933CC','#CCFF00','#FF3399','#FFFF00'],
		$self = $(this);

	takeout();
	function takeout(){
		if(i==times){
            ulhtml = '';
			for(var j=0;j<num;j++){
				ulhtml += '<li class="list-group-item">' + awlist[j].name + '</li>';
			}
			$self.html(ulhtml);
			return callback && callback();

		}else{
			var arr = _.sample(audilist, num),
            ulhtml = '';
			for(var j=0;j<num;j++){
			   ulhtml += '<li class="list-group-item" style="color:' + _.sample(colors) +  ';">' + arr[j].name +'</li>';
			}
			$self.html(ulhtml);
			i++;
			setTimeout(takeout, dtime);
		}
	}
}

$.fn.setAwardsList = function(awlist){
	var num = awlist.length,
		ulhtml = '';
	for(var i=0;i<num;i++){
		ulhtml += '<li class="list-group-item">' + awlist[i].name +'</li>'
	}
	$(this).html(ulhtml);
	ulhtml = '';
}