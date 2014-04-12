(function() {
    "use strict";

    var server = "http://ec2-54-187-51-202.us-west-2.compute.amazonaws.com:3000";
    //var server = "http://localhost:3000";

    $(document).ready(function() {
        $("#alreadyRegistered").click(alreadyRegistered);
        $("#registerForm").hide();
        $("#loginForm").show();
        $("#register").click(register);
        $("#login").click(login);

    });

    // Called when the user clicks the alreadyRegistered text
    function alreadyRegistered() {
        $("#alreadyRegistered").fadeOut("fast");
        $("#loginForm").slideUp("slow", function() {
            $("#registrationForm").slideDown("slow");
        });
    }
    //sendgrid function sending data

    

    function register() {
    	console.log()
        var email = $("#registerEmail").val();
        var password1 = $("#registerPassword").val();

        $.post(server + '/manager/signup', {'email' : email, 'password' : password1}, function(data) {
            if(data.response == 'OK') {
                $.post(server + '/manager/signin', {'email' : email, 'password' : password1}, function(data) {
                    if(data.response == 'OK') {
                        showDash(data);
                    } else {
                        alert(data);
                    }
                });
            } else {
                alert(data)
            }
        });
    }



    function login() {
        var email = $("#loginEmail").val();
        var password1 = $("#loginPassword").val();

        $.post(server + '/manager/signin', {'email' : email, 'password' : password1}, function(data) {
            if(data.response == 'OK') {
                showDash(data);
            } else {
                alert(data);
            }
        });
    }

    function showDash(data) {
		var vm = new DashViewModel(data.manager, server);
		ko.applyBindings(vm);
		$('#intro').slideUp('fast', function() {
			$('#dashboard').slideDown('fast');
		});
    }

})();