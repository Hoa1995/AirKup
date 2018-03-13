
var LocalStrategy   = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var users = require('../model/user');


module.exports = function(passport) {
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.user_id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        users.getUserById(id, function (err, rows) {
            done(err, rows);
        });
    });

    passport.use(
        'local-signup',
        new LocalStrategy({
                // by default, local strategy uses username and password, we will override with email
               usernameField : 'email',
                passwordField : 'password',
                passReqToCallback : true // allows us to pass back the entire request to the callback
            },
            function(req, email, password, done) {
                var email = req.sanitizeBody('email').escape();
                var phoneNumber = req.sanitizeBody('phoneNumber').escape();
                var password = req.sanitizeBody('password').escape();

                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                users.getUserByEmail(email, function (err, rows) {
                    if (err)
                        return done(err);
                    if (rows.length) {
                        return done(null, false, req.flash('signupMessage', 'Email này đã tồn tại'));
                    } else {
                        // if there is no user with that username
                        // create the user
                        var newUser = {
                            email: email,
                            phoneNumber : phoneNumber,
                            password: password
                        };
                        users.setUserToDatabase(newUser, function (err, id) {
                            newUser.user_id = id;

                            return done(null, newUser);
                        });
                    }
                });
            })
    );



    passport.use(
        'local-login',
        new LocalStrategy({
                // by default, local strategy uses username and password, we will override with email
                usernameField : 'email',
                passwordField : 'password',
                passReqToCallback : true // allows us to pass back the entire request to the callback
            },
            function(req, email, password, done) { // callback with email and password from our form
                users.getUserByEmail(email, function (err, rows) {
                    if (err)
                        return done(err);
                    if (!rows.length) {
                        return done(null, false, req.flash('loginMessage', 'Email không tồn tại.')); // req.flash is the way to set flashdata using connect-flash
                    }

                    // if the user is found but the password is wrong
                    if (!bcrypt.compareSync(password, rows[0].password))
                        return done(null, false, req.flash('loginMessage', 'Mật khẩu sai.')); // create the loginMessage and save it to session as flashdata

                    // all is well, return successful user
                    return done(null, rows[0]);
                });
            })

    );


};
