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
            exports.sendSms(phone, userId, function(error, message) {
            exports.sendEmail(name, email, userId, function(error, message)  {  
                res.json({
                    'response': 'OK',
                    'manager': manager,
                    'text_message' : message,
                    'text_errors' : error
                    });
                });
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

exports.sendEmail = function(name, email, msg, callback){
    var sendgrid_username = 'setarah'
    var sendgrid_password = 'Classof2017'
    var sendgrid = require('sendgrid')(sendgrid_username, sendgrid_password);

            //subject : 'IMPORTANT: Your Login Information for ShiftSwape'
    var email = new sendgrid.Email();
        
        email.to(email);
        email.setFrom('info@ShiftSwape.com');
        email.setsubject('IMPORTANT: Your Login Infomration with ShiftSwape');
        email.setText('Hi' + name+', /n Here is your login information for ShiftSwape' + msg + '/nPlease download our mobile app from Android or App Store to start easily change your work schadule when you needed too!/n ShiftSwape Team', userId)

        sendgrid.send(email, function(erro, json){
            if (err) {return console.error(err);}
            console.log(json);
            callback(erro, json);
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
                    'fromId' : ObjectId(swap.toId),
                    'toId' : ObjectId(swap.fromId),
                    'assignmentFrom' : {
                        $match: {
                            'day' : swap.assignmentTo.day,
                            'minute_start' : swap.assignmentTo.minute_start,
                            'minute_end' : swap.assignmentTo.minute_end
                        }
                    },
                    'assignmentTo' : {
                        $match: {
                            'day' : swap.assignmentFrom.day,
                            'minute_start' : swap.assignmentFrom.minute_start,
                            'minute_end' : swap.assignmentFrom.minute_end
                        }
                    }
                }
            }
        },                    
         function(err, manager) {
        if (!manager || err) {
            callback(false);
        } else {
            callback(true);
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
    exports.hasCounterPart(swap, function(status) {
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
            res.json({
                'response': 'OK',
                'swapHappened' : true
            });        
        }
    });
};
