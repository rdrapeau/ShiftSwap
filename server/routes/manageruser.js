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

/*
 * Sign up a user.
 */
exports.addEmployee = function(req, res){
    //add phone user here
    var managerId = req.body.managerId;
    var name = req.body.name;
    var email = req.body.email;
    //var phone = req.body.phone;
    Manager.update(
        {'_id': managerId},
        { $push: { 
            users: {
                '_id' : ObjectId.get(),
                'name': name,
                'email': email
            } 
        } }, 
        function(err) {
            if (err) console.log(err);

        Message.findOne({'_id': managerId}, function(err, manager) {
            res.json({
                'response': 'OK',
                'manager': manager
            });
        });
    });
};

/*
 * Sign in a user
 */
exports.signinEmployee = function(req, res) {
    //authenticate phone user here
<<<<<<< HEAD
    var userId = req.body.userId;
    Manager.findOne({users: {'_id' : user_names}}, function(err, manager) {
        if (!manager) {
            res.json({
                    'response': 'FAIL',
                    'errors': ['User not found']
                });
        } else {
            console.log(manager);
            for(var i = 0; i < manager.users; i++) {
                if (manager.users[i]._id == userId) {
                    manager.myUser = manager.users[i];
=======
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