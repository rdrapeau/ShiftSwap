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
    var phone = req.body.phone;
    var userId = new ObjectId();
    Manager.update(
        {'_id': managerId},
        { $push: { 
            users: {
                '_id' : userId,
                'name': name,
                'email': email,
                'phone': phone
            } 
        } }, 
        function(err) {
            if (err) console.log(err);

        Manager.findOne({'_id': managerId}, function(err, manager) {
            res.json({
                'response': 'OK',
                'manager' : manager
            });
            exports.sendSms(phone, userId, function(error, message) {
                                                                        });
            //exports.sendEmail(name, email, userId, function(error, message)  {  });
    });
});
}

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

exports.sendSms = function(phone, msg, callback){
    var accountSid = 'ACa56a7bfb55a9ee865cac8a57c79168d8';
    var authToken = '280e62aa7905c466289d55eeeb7f7b18';
    var client = require('twilio')(accountSid, authToken);
 

    client.sms.messages.create({
        body : ("Here is your ShiftSwap Login Info " + msg),
        to : phone,
        from : '+14423334553'
    }, function(err, message) {
        callback(err, message);
    });
}




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

exports.getUserFromId = function(userId, callback) {
     Manager.findOne({users: {$elemMatch: {'_id' : ObjectId(userId)}}}, function(err, manager) {
        var result = [];
        if(manager) {
            for(var i = 0; i < manager.users.length; i++) {
                if(manager.users[i]._id == userId) {
                    callback(manager.users[i]);
                    break;
                }
            }
        }
     });
}

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
            exports.getUserFromId(userId, function(user) {
                var schedules = [];
                var subSet = function(arr, callback) {
                    var result = [];
                    for(var i = 0; i < arr.length; i++) {
                        if(callback(arr[i])) {
                            result.push(arr[i]);
                        }
                    }
                    return result;
                };

                for(var i = 0; i < manager.schedules.length; i++) {
                    manager.schedules[i].assignments = subSet(manager.schedules[i].assignments, function(item) {
                        return item.users.indexOf(user.name) != -1;
                    });
                }
                res.json({
                    'response': 'OK',
                    'schedules': manager.schedules,
                    'myUser' : user
                });
            });
        }
    });
};

exports.getAllSchedules = function(req, res){
    console.log(req.body);
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
    var userId = null;
    if(typeof req.body.userId != 'undefined') {
        userId = req.body.userId;
    } else {
        userId = req.session.user._id;
    }
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

exports.hasCounterPart = function(swap, callback) {
    Manager.findOne({
        swaps: {
            $elemMatch: {
                    'fromId' : swap.toId,
                    'toId' : swap.fromId
                }
            }
        },                    
         function(err, manager) {
        if (!manager || err) {
            callback(false, manager);
        } else {
            callback(true, manager);
        }
    });
};

exports.clearSwaps = function(req, res) {
    var fromId = null;
    if(typeof req.body.fromId != 'undefined') {
        fromId = req.body.fromId;
    } else {
        fromId = req.session.user._id;
    }
    Manager.update({users: {$elemMatch: {'_id' : ObjectId(fromId)}}}, {swaps : []}, function(err) {
        if (err) {
            res.json({
                    'response': 'FAIL'
                });
        } else {
            res.json({
                'response': 'OK',
            });
        }
    });
}

exports.assignmentsEqual = function(assignment1, assignment2) {
    return assignment1.start_minute == assignment2.end_minute &&
            assignment1.end_minute == assignment2.start_minute &&
            assignment1.day == assignment2.day;
}

exports.removeElt = function(arr, elem) {
    for(var i = arr.length - 1; i >= 0; i--) {
        if(arr[i] === elem) {
           arr.splice(i, 1);
        }
    }
    return arr;
}

exports.doSwap = function(schedules, assignment1, assignment2, id1, id2, callback) {
    exports.getUserFromId(id1, function(user1) {
        exports.getUserFromId(id2, function(user2) {
            for(var i = 0; i < schedules.length; i++) {
                for(var j = 0; j < schedules[i].length; j++) {
                    if((assignmentsEqual(schedules[i].assignments[j], assignment1) || 
                        assignmentsEqual(schedules[i].assignments[j], assignment2))
                     && schedules[i].assignments[j].users.indexOf(user1.name) != -1) {
                        schedules[i].assignments[j].users = exports.removeElt(schedules[i].assignments[j].users, user1);
                        schedules[i].assignments[j].users.push(user2);
                    } else if (assignmentsEqual(schedules[i].assignments[j], assignment1) || 
                        assignmentsEqual(schedules[i].assignments[j], assignment2)){
                        schedules[i].assignments[j].users = exports.removeElt(schedules[i].assignments[j].users, user2);
                        schedules[i].assignments[j].users.push(user1);
                    }
                }
            }
            callback(schedules);
        });
    });
}

exports.swapsMatch = function (one, two) {
    return one.toId == two.fromId && one.fromId == two.toId &&
            one.assignmentFrom.day == two.assignmentTo.day &&
            one.assignmentFrom.start_minute == two.assignmentTo.start_minute &&
            one.assignmentTo.start_minute == two.assignmentFrom.start_minute &&
            one.assignmentFrom.end_minute == two.assignmentTo.end_minute &&
            one.assignmentTo.end_minute == two.assignmentFrom.end_minute;
}

exports.doSwaps = function(manager, callback) {
    var happened = true;
    for(var i = 0; i < manager.swaps.length; i++) {
        for(var j = 0; j < manager.swaps.length; j++) {
            if(exports.swapsMatch(manager.swaps[i], manager.swaps[j])) {

                exports.doSwap(manager.schedules, manager.swaps[i].assignmentFrom, manager.swaps[i].assignTo, manager.swaps[i].toId, manager.swaps[i].fromId, function(schedules) {
                    Manager.update({_id : manager._id}, {schedules : schedules}, function(err) {

                    });
                });
            }
        }
    }
     callback(happened);
}

exports.addSwap = function(req, res){
    console.log(req.body);
    var fromId = null;
    if(typeof req.body.fromId != 'undefined') {
        fromId = req.body.fromId;
    } else {
        fromId = req.session.user._id;
    }
    var toId = req.body.toId;
    var assignmentFrom = req.body.assignmentFrom;
    var assignmentTo = req.body.assignmentTo;

    var swap = {
                'fromId': fromId,
                'toId': toId,
                'assignmentFrom' : assignmentFrom,
                'assignmentTo' : assignmentTo
                };
    exports.hasCounterPart(swap, function(status, manager) {
        if(!status) {
            Manager.update(
               {users: {$elemMatch: {'_id' : ObjectId(fromId)}}},
               {
                $push: { 
                    swaps: swap
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
                            'swapHappened' : false
                        });
                    }
                });
        } else {
            //exports.doSwaps(manager, swap, function(happened) {
                res.json({
                    'response': 'OK',
                    'swapHappened' : true
                });
            //});
        }
    });
};
