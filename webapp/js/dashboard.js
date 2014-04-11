$(document).ready(function() {
	var mgnObj = {
		'_id' : '923849238492',
		'username' : 'necha',
		'users' : [
			{
				'code' : 'UNIQUE',
				'name' : 'Aaron Nech'
			}
		]
	}

	var vm = new DashViewModel(mgnObj);

	ko.applyBindings(vm);
});