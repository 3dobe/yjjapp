
$.fn.drawPieChart = function(options, colors){
    var ctx,
        myNewChart,
        values=[],
        data = [];

    if (_.every(options, function(option) {
        return option.count === 0;
    })) {
        values = _.map(options, function(option, i){
            return 1;
        });
    } else {
        values = _.map(options, function(option, i){
            return option.count;
        });
    }
    _.each(values, function(val, i) {
        data.push({
            value: values[i],
            color: colors[i]
        });
    });

    ctx = this[0].getContext("2d");
    myNewChart = new Chart(ctx).Pie(data);
}
