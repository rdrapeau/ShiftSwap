var DashViewModel = function(data, server) {
	var self = this;

	var now = new Date();
	var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	var lastSunday = new Date(today.setDate(today.getDate()-today.getDay()));

	var displayData = $.grep(data.schedules, function(item) {
		return item.startTime == +(lastSunday) + "";
	});

	var calendar = new Calendar('.calendar', displayData, self);
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
	self.employeePhone = new ko.observable("");
	self.assignments = new ko.observableArray();

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

	self.addEmployee = function() {
		$.post(server + '/user/signup', {'name' : self.employeeName(), 'email' : self.employeeEmail(), 'phone' : self.employeePhone()}, function(data) {
			if(data.response == 'FAIL') {
				alert("Something went wrong!");
			} else {
				self.users.removeAll();
				self.userOptions.removeAll();
				transferArray(self.users, data.manager.users);
				for(var i = 0; i < self.users().length; i ++) {
					self.userOptions.push(self.users()[i].name);
				}
			}
		});
		return true;
	};

	self.submitSchedule = function() {
		$.post(server + '/manager/addschedule', {'startTime' : +(lastSunday), 'assignments' : self.assignments()}, function(data) {
			if(data.response == 'FAIL') {
				alert("Something went wrong!");
			} else {
				alert('Schedule published!')
			}
		});		
		return true;
	};

	self.loadUserRecord = function() {

	};

	self.addAssignment = function(assignment) {
		self.assignments.push(assignment);
	};

	self.removeAssignment = function(assignment) {
		self.assignments.remove(function(item) {
			return assignment.day == item.day &&
					assignment['start_minute'] == item['start_minute'] &&
					assignment['end_minute'] == item['end_minute'];
		});
	}

	self.nextWeek = function() {

	};

	self.prevWeek = function() {

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
		self.assignments(assignments);
		calendar = new Calendar('.calendar', {"assignments" : assignments, "startTime" : +(lastSunday)}, self);
	}
}