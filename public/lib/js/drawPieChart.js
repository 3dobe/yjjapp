(function() {
    var ctx,
        myNewChart,
        values=[],
        data = [];


    window.drawPieChart = function(options, colors){
        if (_.every(options, function(num, word) {
            return num === 0;
        })) {
            values = _.map(options, function(){
                return 1;
            });
        } else {
            values = _.map(options, function(num, word){
                return num;
            });
        }
        _.each(values, function(val, i) {
            data.push({
                value: values[i],
                color: colors[i]
            });
        });


        console.log(data)
        ctx = document.getElementById("myChart").getContext("2d");
        myNewChart = new Chart(ctx).Pie(data);
    }
})();
