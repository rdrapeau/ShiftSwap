function Calendar(dom, data, vm) {
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
	var selectIndex = 0;

	var inRange = function (start, end, suspect) {
		// console.log(suspect.data('day') + ' >= ' + start.data('day')); 
		// console.log(suspect.data('day') + ' <= ' + end.data('day'));
		// console.log(suspect.data('minute') + ' >= ' + start.data('minutes'));
		// console.log(suspect.data('minute') + ' <= ' + end.data('minutes'));
		return suspect.data('day') >= start.data('day') &&
				suspect.data('day') <= end.data('day') &&
				suspect.data('minutes') >= start.data('minutes') &&
				suspect.data('minutes') <= end.data('minutes') &&
				suspect.data('day') == start.data('day');
	}

	var inPerm = function (end) {
		return end.hasClass('perm-selected');
	}

	var handleSelection = function (start, end) {
		var selection = [];

		$('.cal-filler').removeClass('selected');
		$('.cal-filler').removeClass('no-go');

		cals.find('.cal-row').each(function() {
			$(this).find('.cal-filler').each(function() {
				if (inRange(start, end, $(this))) {
					selection.push($(this));
				}
			});
		});

		var okay = true;
		for(var i = 0; i < selection.length; i++) {
			if(selection[i].hasClass('perm-selected')) {
				okay = false;
				break;
			}
		}

		for(var i = 0; i < selection.length; i++) {
			selection[i].addClass(okay ? 'selected' : 'no-go');
		}
		if(selection.length > 0) {
			vm.showSelected(true);
			vm.selectedStart(get12HourTime(selection[0].data('minutes')));
			vm.selectedEnd(get12HourTime(selection[selection.length - 1].data('minutes')));
		} else {
			vm.showSelected(false);
			vm.selectedStart("");
			vm.selectedEnd("");			
		}

		return selection;
	};

	var sameSelection = function(one, two) {
		return one[0] == two[0];
	}


	var saveSelection = function(selection) {
		if($('.no-go').length > 0) {
			$('.cal-filler').removeClass('no-go');
			vm.showSelected(false);
			vm.selectedStart("");
			vm.selectedEnd("");		
		} else {
			$('.cal-filler.selected').each(function () {
				$(this).removeClass('selected');
				$(this).addClass('perm-selected');
				$(this).data('selected-index', selectIndex);
			});
			selectIndex++;
			editSelection(selection);
		}
	}

	var editSelection = function(selection) {
		vm.showSelected(false);
		vm.selectedStart("");
		vm.selectedEnd("");	
		$('#add-assignment-modal').unbind('shown.bs.modal');
		vm.editAssignmentFrom(get12HourTime(selection[0].data('minutes')));
		vm.editAssignmentTo(get12HourTime(selection[selection.length - 1].data('minutes')));
		$('#add-assignment-modal').on('shown.bs.modal', function() {
			for(var i = 0; i < selection.length; i++) {
				selection[i].click(function() {
					console.log("EDIT");
				});
			}
			$('#add-assignment-modal').find('.modal-close, .close, .modal-confirm').unbind('click');
			$('#add-assignment-modal').find('.modal-close, .close').click(function() {
				for(var i = 0; i < selection.length; i++) {
					selection[i].removeClass('perm-selected');
				}
				vm.showSelected(false);
				vm.selectedStart("");
				vm.selectedEnd("");		
				return true;
			});
			$('#add-assignment-modal').find('.modal-confirm').click(function() {
				for(var i = 0; i < selection.length; i++) {
					selection[i].click(function() {
						if(!$('#add-assignment-modal').hasClass('in')) {
							editSelection(selection);
						}
					});
				}
				return true;
			});
		});
		$('#add-assignment-modal').modal('show');
	}

	$('.cal-filler').mousedown(function(e) {
		start = $(this);
		e.preventDefault();
	});

	$('.cal-filler').mouseenter(function() {
		if(start != null) {
			handleSelection(start, $(this));
		}
	});

	$('.cal-filler').mouseup(function() {
		if (sameSelection(start, $(this))) {
			start = null;
			$('.cal-filler').removeClass('selected');
			return true;
		}
		var selection = handleSelection(start, $(this));
		start = null;
		if(selection.length > 0)
			saveSelection(selection);
	});
}