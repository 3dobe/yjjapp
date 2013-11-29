
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

    // fix chrome bug
    if (_.isEqual(_.compact(values), [1])) {
        var index = values.indexOf(1),
            ix = index === 0 ? 1 : index - 1,
            diff = 0.0000001;
        values[index] -= diff;
        values[ix] += diff;
    }

    _.each(values, function(val, i) {
        data.push({
            value: values[i],
            color: colors[i]
        });
    });

    ctx = this[0].getContext("2d");
    myNewChart = new Chart(ctx).Pie(data, {
        segmentStrokeWidth: 6,
        animateScale: true
    });
}
