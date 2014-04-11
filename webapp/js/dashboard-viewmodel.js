var DashViewModel = function(data) {
	var self = this;
	var calendar = new Calendar('.calendar', [], self);
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

	self.userOptions = new ko.observableArray();
	self.assignmentUsers = new ko.observableArray();

	self.employeeName = new ko.observable("");
	self.employeeEmail = new ko.observable("");

	self.name = data.username;
	self.users = new ko.observableArray();

	transferArray(self.users, data.users);
	for(var i = 0; i < self.users().length; i ++) {
		self.userOptions.push(self.users()[i].name);
	}

	self.selectedTimeRange = new ko.computed(function() {
		return self.selectedStart() + ":" + self.selectedEnd();
	});

	self.loadSelectionUsers = function(users) {
		self.assignmentUsers.removeAll();
		for(var i = 0; i < users.length; i++) {
			self.assignmentUsers.push($('[data-id="' + users[i] + '"]').data('name'));
		}
	}

	self.loadUserRecord = function() {

	}

	self.nextWeek = function() {

	};

	self.prevWeek = function() {

	};

	self.nextWeek = function() {

	};

	self.randomSchedule = function() {
		calendar = new Calendar('.calendar', data.schedules[0].assignments, self);
	}

	self.fiveToEight = function() {
		var assignments = [
			{
				'users' : [],
				'day' : 1,
				'startMinute' : 8 * 60,
				'endMinute' : 17 * 60
			},
			{
				'users' : [],
				'day' : 2,
				'startMinute' : 8 * 60,
				'endMinute' : 17 * 60
			},
			{
				'users' : [],
				'day' : 3,
				'startMinute' : 8 * 60,
				'endMinute' : 17 * 60
			},
			{
				'users' : [],
				'day' : 4,
				'startMinute' : 8 * 60,
				'endMinute' : 17 * 60
			},
			{
				'users' : [],
				'day' : 5,
				'startMinute' : 8 * 60,
				'endMinute' : 17 * 60
			}
		];
		calendar = new Calendar('.calendar', assignments, self);
	}
}