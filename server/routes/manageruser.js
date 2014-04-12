var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId
var User = require('./../models/manageruser');
var request = require('request');


/*
*
*
* MANAGER FUNCTIONS
*
* 
 */

/*
 * Sign up a manager.
 */
exports.signup = function(req, res){
    // get the form values from "name" attribute of the form
    var manager = new Manager({
        'email': req.body.email,
        'password' : req.body.password
    });

    console.log('signing up ' + manager.email);

    manager.save(function(err) {
        if (err) {
            // TODO make it works for the plugin I'm using
            console.log('got into error');
            if (err.code == 11000) {
                console.log('\n----' + err + '---');
                res.json({
                    'response': 'FAIL',
                    'errors': ["Manager already exists"]
                });
            } else {
                console.log(err);
                var fail_msgs = [];
                for (var field in err.errors) {
                    fail_msgs.push(err.errors[field].message);
                }
                res.json({
                    'response': 'FAIL',
                    'errors': fail_msgs
                });
            }
        } else {
            // successful registration
            res.json({
                'response': 'OK',
                'manager': manager
            });
        }
    });
};

/*
 * Sign in a manager
 */
exports.signin = function(req, res) {
    console.log(req);
    var email = req.body.email.toString().toLowerCase();
    var password = req.body.password;
    console.log('signing in ' + email);

    User.findOne( {email: email, password : password}, function(err, manager) {
        if (!manager) {
            res.json({
                    'response': 'FAIL',
                    'errors': ['Manager not found']
                });
        } else {
            console.log(manager);
            // save the manager in sessions to be retrieved later
            req.session.manager = manager;   
            // successful registration
            res.json({
                'response': 'OK',
                'manager': manager
            });
        }
    });
};



/*
*
*
* USER FUNCTIONS
*
* 
 */
exports.user = {};

/*
 * Sign up a user.
 */
exports.user.add = function(req, res){
    //add phone user here
    var number = 
};

/*
 * Sign in a user
 */
exports.user.signin = function(req, res) {
    //authenticate phone user here
    var user_names = req.body;
    for (user_names){
        Manager.findOne({user_names: user_names})
    }
}
};

exports.manager.addEmployee = function(user, email){
    var user_names = user.body.user_names;
    var employee_email = email.body.employee_email.toLowerCase();
    console.log('You have added' + user_names + 'with email' + employee_email);
    ObjectId user_nameID =ObjectId.get(user_names);

}

//password rest





















// password reset //
module.exports = function(app) {

    app.get('/', function(req, res){
    // check if the user's credentials are saved in a cookie //
        if (req.cookies.user == undefined || req.cookies.pass == undefined){
            res.render('login', { title: 'Hello - Please Login To Your Account' });
        }   else{
    // attempt automatic login //
            AM.autoLogin(req.cookies.user, req.cookies.pass, function(o){
                if (o != null){
                    req.session.user = o;
                    res.redirect('/home');
                }   else{
                    res.render('login', { title: 'Hello - Please Login To Your Account' });
                }
            });
        }
    });
    
    app.post('/', function(req, res){
        AM.manualLogin(req.param('user'), req.param('pass'), function(e, o){
            if (!o){
                res.send(e, 400);
            }   else{
                req.session.user = o;
                if (req.param('remember-me') == 'true'){
                    res.cookie('user', o.user, { maxAge: 900000 });
                    res.cookie('pass', o.pass, { maxAge: 900000 });
                }
                res.send(o, 200);
            }
        });
    });

    app.post('/lost-password', function(req, res){
    // look up the user's account via their email //
        AM.getAccountByEmail(req.param('email'), function(o){
            if (o){
                res.send('ok', 200);
                EM.dispatchResetPasswordLink(o, function(e, m){
                // this callback takes a moment to return //
                // should add an ajax loader to give user feedback //
                    if (!e) {
                    //  res.send('ok', 200);
                    }   else{
                        res.send('email-server-error', 400);
                        for (k in e) console.log('error : ', k, e[k]);
                    }
                });
            }   else{
                res.send('email-not-found', 400);
            }
        });
    });

    app.get('/reset-password', function(req, res) {
        var email = req.query["e"];
        var passH = req.query["p"];
        AM.validateResetLink(email, passH, function(e){
            if (e != 'ok'){
                res.redirect('/');
            } else{
    // save the user's email in a session instead of sending to the client //
                req.session.reset = { email:email, passHash:passH };
                res.render('reset', { title : 'Reset Password' });
            }
        })
    });
    
    app.post('/reset-password', function(req, res) {
        var nPass = req.param('pass');
    // retrieve the user's email from the session to lookup their account and reset password //
        var email = req.session.reset.email;
    // destory the session immediately after retrieving the stored email //
        req.session.destroy();
        AM.updatePassword(email, nPass, function(e, o){
            if (o){
                res.send('ok', 200);
            }   else{
                res.send('unable to update password', 400);
            }
        })
    });
}    



