(function() {
    "use strict";

    var server = "http://ec2-54-187-51-202.us-west-2.compute.amazonaws.com:3000";
    //var server = "http://localhost:3000";

    $(document).ready(function() {
        $("#alreadyRegistered").click(alreadyRegistered);
        $("#register").click(register);
        $("#login").click(login);
        $("#sign-in").click(sendgrid);

    });

    // Called when the user clicks the alreadyRegistered text
    function alreadyRegistered() {
        $("#alreadyRegistered").fadeOut("fast");
        $("#registerForm").slideUp("slow", function() {
            $("#loginForm").slideDown("slow");
        });
    }
    //sendgrid function sending data

    function sendgrid(){
        console.log("Click");
        var sendgrid_username = 'setarehlotfi94@hotmaitl.com'
        var sendgrid_password = 'Classof2017'
        var email = employees_Email
         $.get(server + '/manager/', {'email' : self.employeeEmail()}, function(data) {
            if(data.response == 'OK') {
                $.get(server + '/manager/', {'email' : self.employeeEmail()}, function(data) {
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
            //subject : 'IMPORTANT: Your Login Information for ShiftSwape'
        var sendgrid = require('sendgrid')(sendgrid_username, sendgrid_password);
        var email = new sendgrid.Email();
        
        email.addTo(to);
        email.setFrom('info@ShiftSwape.com');
        email.setsubject('Your Login Infomration with SendGrid');
        email.setText('Here is your login information for ShiftSwape: %d Please download our mobile app from Android or App Store and Start Swapping your shifts when you needed too!', userId)

        sendgrid.send(email, function(erro, json){
            if (err) {return console.error(err);}
            console.log(json);
        });
    
    }

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