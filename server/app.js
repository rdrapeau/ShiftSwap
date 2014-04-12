var express = require('express'),
    db = require('./config/db'),
    routes = require('./routes'),
    managerUser = require('./routes/manageruser'),
    constants = require('./config/constants'),
    http = require('http'),
    path = require('path'),
    middleware = require('./config/middleware.js'),
    app = express();

// all environments
app.configure(function(){
    // read port from .env file
    app.set('port', process.env.PORT || 3000);
    // locate the views folder
    app.set('views', __dirname + '/views');
    // we are using jade templating engine
    app.set('view engine', 'jade');
    // the favicon to use for our app
    app.use(express.favicon(path.join(__dirname, 'public/images/favicon.ico')));
    // watch network requests to express in realtime
    app.use(express.logger('dev'));
    // sign the cookies, so we know if they have been changed
    app.use(express.cookieParser('keyboard cat'));
    // allows to read values in a submitted form
    app.use(express.bodyParser());
    // faux HTTP requests - PUT or DELETE
    app.use(express.methodOverride());
    app.use(express.session({
        secret: 'my secret'
      }));
    // invokes the routes' callbacks
    app.use(app.router);
    // every file <file> in /public is served at example.com/<file>
    app.use(express.static(path.join(__dirname, 'public')));
});


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });

// sign up a user
app.post('/user/signup', managerUser.addEmployee);

// login the user
app.post('/user/signin', managerUser.signinEmployee);

// sign up a manager
app.post('/manager/signup', managerUser.signup);

// login the user
app.post('/manager/signin', managerUser.signin);

// add a new schedule (group of assignments)
app.post('/manager/addschedule', middleware.requiresManager, managerUser.addSchedule);

// gets all the schedules for a user
app.get('/user/getmyschedule', middleware.requiresUser, managerUser.getMySchedule);

// gets all the swap requests
app.get('/user/getswaps', middleware.requiresUser, managerUser.getSwaps);

// Adds a swap request to this user's manager
app.post('/user/addswap', middleware.requiresUser, managerUser.addSwap);

// gets all the swap requests that are not this users
//app.get('/user/swaps', middleware.requiresUser, managerUser.user.getSwaps);

// Start the server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
