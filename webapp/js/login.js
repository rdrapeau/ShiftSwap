(function() {
    "use strict";

    $(document).ready(function() {
        $("#alreadyRegistered").click(alreadyRegistered);
        $("#remember").hide();
        $("#register").click(register)
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
        var company = $("#registerCompany").val();
        var password1 = $("#registerPassword").val();
        var password2 = $("#registerPassword2").val();

        // On Success Bring up the login forms
        $("#welcomeText").fadeIn("slow");
        alreadyRegistered();
    }

})();