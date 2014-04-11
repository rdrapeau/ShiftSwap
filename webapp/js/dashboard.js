$(document).ready(function() {
	var mgnObj = {
		'_id' : '923849238492',
		'username' : 'necha',
		'password' : 'password',
		'users' : [
			{
				'code' : 'UNIQUE',
				'name' : 'Aaron Nech',
				'email' : 'necha@cs.washington.edu'
			}
		],
		'schedules' : [
			{
				'start' : 9234234234,
				'assignments' : [
					{
						'users' : ['list', 'of', 'unique_codes'],
						'day' : 0,
						'startMinute' : 15,
						'endMinute' : 300
					}
				]
			}
		]
	}

	var vm = new DashViewModel(mgnObj);

	ko.applyBindings(vm);
});