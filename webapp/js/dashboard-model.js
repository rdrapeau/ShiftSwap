function Calendar(dom, data) {
	var cals = $(dom);
	var granularity = 4 * 24; // 15 minutes
	var minutesPer = Math.floor((24.0 / granularity) * 60);
	var rowMarkup = '<tr class="cal-row"><td class="cal-time"></td><td class="cal-filler"></td><td class="cal-filler"></td><td class="cal-filler"></td><td class="cal-filler"></td><td class="cal-filler"></td><td class="cal-filler"></td><td class="cal-filler"></td></tr>';

	for(var i = 0; i < granularity; i++) {
		cals.append($(rowMarkup));
	}

	var get24HourTime = function(minutesSinceMidnight) {
	    var hours = Math.round(minutesSinceMidnight / 60);
	    var minutes = minutesSinceMidnight % 60;
	    return padZero(hours)+  ":" + padZero(minutes);
	}

	var padZero = function(number) {
	    return number.toString().length == 1 ? "0" + number.toString() : number;
	}

	var get12HourTime = function(minutesSinceMidnight) {
		if (minutesSinceMidnight == 0) {
			return "12:00 am";
		} else if(minutesSinceMidnight == 12 * 60) {
			return "12:00 pm";
		}
	    var militaryTime = get24HourTime(minutesSinceMidnight);
	    var time = militaryTime.split(":");

	    var amPm = "am";
	    if (parseInt(time[0]) > 12) {
	        amPm = "pm";
	        time[0] = padZero(parseInt(time[0]) - 12);
	    }
	    return time[0] + ":" + time[1] + " " + amPm;
	}

	var i = 0;
	cals.find('.cal-time').each(function() {
		var day = 0;
		$(this).parent().find('.cal-filler').each(function() {
			console.log('work');
			$(this).data('minutes', i * minutesPer);
			$(this).data('day', day);
			//$(this).html(day + ',' + i * minutesPer);
			day ++;
		});
		if(i % 4 == 0) {
			$(this).text(get12HourTime(i * minutesPer));
		}
		i++;
	});

	var start = null;

	var inRange = function (start, end, suspect) {
				// console.log(suspect.data('day') + ' >= ' + start.data('day')); 
				// console.log(suspect.data('day') + ' <= ' + end.data('day'));
				// console.log(suspect.data('minute') + ' >= ' + start.data('minutes'));
				// console.log(suspect.data('minute') + ' <= ' + end.data('minutes'));
		return suspect.data('day') >= start.data('day') &&
				suspect.data('day') <= end.data('day') &&
				suspect.data('minutes') >= start.data('minutes') &&
				suspect.data('minutes') <= end.data('minutes');
	}

	var handleSelection = function (start, end) {
		$('.cal-filler').removeClass('selected');

		cals.find('.cal-row').each(function() {
			$(this).find('.cal-filler').each(function() {
				if (inRange(start, end, $(this))) {
					$(this).addClass('selected');
				}
			});
		});
	};

	$('.cal-filler').mousedown(function(e) {
		console.log('mouse down');
		start = $(this);
		e.preventDefault();
	});

	$('.cal-filler').mouseenter(function() {
		console.log('mouse enter');
		if(start != null) {
			handleSelection(start, $(this));
		}
	});

	$('.cal-filler').mouseup(function() {
		console.log('mouse up');
		handleSelection(start, $(this));
		start = null;
	});
}