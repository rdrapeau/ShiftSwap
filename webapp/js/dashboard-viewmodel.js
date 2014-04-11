var DashViewModel = function(data) {
	var self = this;
	var calendar = new Calendar('.calendar', {}, self);
	$(document).on('mousemove', function(e){
	    $('.marker').css({
	       left:  e.pageX + 15,
	       top:   e.pageY - 15
	    });
	});

	var transferArray = function (obs, normal) {
		for(var i = 0; i < normal.length; i++) {
			obs.push(normal[i]);
		}		
	}

	self.editAssignmentFrom = new ko.observable("");
	self.editAssignmentTo = new ko.observable("");
	self.selectedStart = new ko.observable("");
	self.selectedEnd = new ko.observable("");
	self.showSelected = new ko.observable(false);

	self.name = data.username;
	self.users = new ko.observableArray();

	transferArray(self.users, data.users);


	self.selectedTimeRange = new ko.computed(function() {
		return self.selectedStart() + ":" + self.selectedEnd();
	});
}