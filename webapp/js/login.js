(function() {
    "use strict";

    var server = "http://localhost:3000";

    $(document).ready(function() {
        $("#alreadyRegistered").click(alreadyRegistered);
        $("#remember").hide();
        $("#register").click(register);
        $("#login").click(login);
    });

    // Called when the user clicks the alreadyRegistered text
    function alreadyRegistered() {
        $("#alreadyRegistered").fadeOut("fast");
        $("#registerForm").slideUp("slow", function() {
        $("#loginForm").slideDown("slow");
        $("#remember").show();    
        });
    }

    // Called when the user clicks the register button
    function register() {
        var email = $("#registerEmail").val();
        var password1 = $("#registerPassword").val();

        $.post(server + '/manager/signup', {'email' : email, 'password' : password1}, function(data) {
            if(data.response == 'OK') {
                $.post(server + '/manager/signin', {'email' : email, 'password' : password1}, function(data) {
                    if(data.response == 'OK') {
                        window.location = 'dashboard.html';
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
                window.location = 'dashboard.html';
            } else {
                alert(data);
            }
        });
    }

})();