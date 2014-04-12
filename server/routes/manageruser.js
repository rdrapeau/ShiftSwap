var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId
var Manager = require('./../models/manageruser');
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
    console.log(req.body);
    // get the form values from "name" attribute of the form
    var manager = new Manager({
        'email': req.body.email,
        'password' : req.body.password
    });

    console.log('signing up ' + manager.email);
    console.log(manager.password);

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
    console.log(req.body);
    var email = req.body.email;
    var password = req.body.password;
    console.log('signing in ' + email);

    Manager.findOne( {email: email, password : password}, function(err, manager) {
        if (!manager) {
            res.json({
                    'response': 'FAIL',
                    'errors': ['Manager not found']
                });
        } else {
            console.log(manager);
            // save the manager in sessions to be retrieved later
            req.session.manager = manager;
            console.log(req.session);
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
    console.log(req.body);
    //add phone user here
    var managerId = req.session.manager._id;
    var name = req.body.name;
    var email = req.body.email;
    //var phone = req.body.phone;
    Manager.update(
        {'_id': managerId},
        { $push: { 
            users: {
                '_id' : new ObjectId(),
                'name': name,
                'email': email
            } 
        } }, 
        function(err) {
            if (err) console.log(err);

        Manager.findOne({'_id': managerId}, function(err, manager) {
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
    console.log(req.body);
    //authenticate phone user here
    var userId = req.body.userId;
    console.log("SIGN IN EMPLOYEE: " + userId);
    Manager.findOne({users: {$elemMatch: {'_id' : ObjectId(userId)}}}, function(err, manager) {
        if (!manager || err) {
            res.json({
                    'response': 'FAIL',
                    'errors': ['User not found']
                });
        } else {
            var myUser = {}
            for(var i = 0; i < manager.users.length; i++) {
                if (manager.users[i]._id.toString() == userId.toString()) {
                    myUser = manager.users[i];
                }
            }
            req.session.user = myUser;
            res.json({
                'response': 'OK',
                'manager': manager,
                'myUser' : myUser
            });
        }
    });
};


exports.addSchedule = function(req, res){
    console.log(req.body);
    //add phone user here
    var managerId = req.session.manager._id;
    var startTime = req.body.startTime;
    var assignments = req.body.assignments;
    //var phone = req.body.phone;
    Manager.update(
        {'_id': managerId},
        { $push: { 
            schedules: {
                'startTime' : startTime,
                'assignments': assignments
            } 
        } }, 
        function(err) {
            if (err) console.log(err);

        Manager.findOne({'_id': managerId}, function(err, manager) {
            res.json({
                'response': 'OK',
                'manager': manager
            });
        });
    });
};

exports.getMySchedule = function(req, res){
    console.log(req.body);
    //add phone user here
    var userId = null;
    if(typeof req.body.userId != 'undefined') {
        userId = req.body.userId;
    } else {
        userId = req.session.user._id;
    }
    Manager.findOne({users: {$elemMatch: {'_id' : ObjectId(userId)}}}, function(err, manager) {
        if (!manager || err) {
            console.log(manager);
            console.log(err);
            res.json({
                    'response': 'FAIL',
                    'errors': err
                });
        } else {
            var schedules = [];
            for(var i = 0; i < manager.schedules.length; i++) {
                for(var j = 0; j < manager.schedules[i].assignments.length; j++) {
                    if(manager.schedules[i].assignments[j].users.indexOf(userId) != -1) {
                        schedules.push(manager.schedules[i]);
                    }
                }
            }
            res.json({
                'response': 'OK',
                'schedules': schedules,
                'myUser' : req.session.user
            });
        }
    });
};

exports.getAllSchedules = function(req, res){
    console.log(req.body);
    //add phone user here
    var userId = req.session.user._id;
    Manager.findOne({users: {$elemMatch: {'_id' : ObjectId(userId)}}}, function(err, manager) {
        if (!manager || err) {
            console.log(manager);
            console.log(err);
            res.json({
                    'response': 'FAIL',
                    'errors': err
                });
        } else {
            res.json({
                'response': 'OK',
                'schedules': manager.schedules,
                'myUser' : req.session.user
            });
        }
    });
};

exports.getSwaps = function(req, res){
    console.log(req.body);
    var userId = req.session.user._id;
    Manager.findOne({users: {$elemMatch: {'_id' : ObjectId(userId)}}}, function(err, manager) {
        if (!manager || err) {
            res.json({
                    'response': 'FAIL',
                    'errors': ['User not found']
                });
        } else {
            res.json({
                'response': 'OK',
                'swaps': manager.swaps,
                'myUser' : req.session.user
            });
        }
    });
};


exports.addSwap = function(req, res){
    console.log(req.body);
    var fromId = req.session.user._id;
    var toId = req.body.toId;
    var assignmentFrom = req.body.assignmentFrom;
    var assignmentTo = req.body.assignmentTo;
    Manager.update(
       {users: {$elemMatch: {'_id' : ObjectId(userId)}}},
       {
        $push: { 
            swaps: {
                'fromId': fromId,
                'toId': toId,
                'assignmentFrom' : assignmentFrom,
                'assignmentTo' : assignmentTo
            }
        } 
       }, function(err) {
            if (err) {
                console.log(err);
                res.json({
                    'response': 'FAIL',
                    'errors': ['User not found']
                });
            } else {
                res.json({
                    'response': 'OK',
                    'swaps': manager.swaps,
                    'myUser' : req.session.user
                });
            }
        });
};

// exports.acceptSwap = function(req, res){
//     var fromId = req.session.user._id;
//     var toId = req.body.toId;
//     var assignmentFrom = req.body.assignmentFrom;
//     var assignmentTo = req.body.assignmentTo;
// };
