
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
	var index = values.indexOf(1);
	if (index > -1 && _.compact(values).length < 2) {
		var ix = index === 0 ? 1 : index - 1,
			diff = 0.0000001;
		values[index] -= diff;
		values[ix] += diff;
	}

	data = _.map(values, function(val, i){
		return {
			color: colors[i],
			value: val
		}
	});

	ctx = this[0].getContext("2d");
	myNewChart = new Chart(ctx).Pie(data, {
		segmentStrokeWidth: 6,
		animateScale: true
	});
}
