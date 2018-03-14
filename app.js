
var express  = require('express');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var morgan = require('morgan');
var app      = express();
var port     = process.env.PORT || 3000;
var passport = require('passport');
var flash    = require('connect-flash');
var expressJwt = require('express-jwt');
// var csrf =  require('csurf');
// var helmet  = require('helmet');
var path = require('path');




// connect to our database
//
require('./config/passport')(passport);// pass passport for configuration

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // set up ejs for templating


// set up our express application
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(expressValidator());

// app.use(function(req, res, next) {
//     for (var item in req.body) {
//         req.sanitize(item).escape();
//     }
//     next();
// });

// app.use(helmet.contentSecurityPolicy({
//     directives: {
//         defaultSrc: ["'self'"],
//         styleSrc: ["'self'", 'maxcdn.bootstrapcdn.com']
//     }
// }));
// Implement X-XSS-Protection
// app.use(helmet.xssFilter());
// app.use(helmet.frameguard('deny'));
const SERVER_SECRET = 'Airhuby_Book';

// required for passport
app.use(session({
    secret: 'Airhuby Book',
    resave: true,
    saveUninitialized: true

} )); // session secret
app.use(passport.initialize());
app.use(passport.session());

// app.use(csrf());
// app.use(function (req, res, next) {
//     res.cookie('XSRF-TOKEN', req.csrfToken());
//     res.locals.csrftoken = req.csrfToken();
//     next();
// });




// persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
// =============================================================================

// ================= Protected APIs for authenticated Users ====================




// routes
require('./routes/admin')(app, passport);
require('./routes/API_Authentication.js')(app, passport, SERVER_SECRET);
require('./routes/API_Category_Home.js')(app, passport, SERVER_SECRET); // load our routes and pass in our app and fully configured passport






app.listen(port);
console.log('Server is running on port:  ' + port);





