// make sure user is logged in
exports.requiresManager = function (req, res, next) {
    if (req.session.manager) {
        return next();
    } else {
        res.json({
            'response': 'FAIL',
            'errors': ['Sign in (manager) required']
        });
    }
}


exports.requiresUser = function (req, res, next) {
    //if (req.session.user) {
        return next();
    //} else {
       // // res.json({
       //      'response': 'FAIL',
       //      'errors': ['Sign in (user) required']
       //  });
    //}
}