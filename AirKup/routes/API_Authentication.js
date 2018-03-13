var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
module.exports = function(app, passport, SERVER_SECRET) {


// =========== authenticate login info and generate access token ===============

    app.post('/api/auth/login', function(req, res, next) {
        passport.authenticate('local-login', function(err, user, info) {
            if (err) { return next(err); }
            // stop if it fails
            if (!user) { return res.json({ message: 'Invalid Username of Password' }); }

            req.logIn(user, function(err) {
                // return if does not match
                if (err) { return next(err); }

                // generate token if it succeeds
                const db = {
                    updateOrCreate: function(user, cb){
                        cb(null, user);
                    }
                };
                db.updateOrCreate(req.user, function(err, user){
                    if(err) {return next(err);}
                    // store the updated information in req.user again
                    req.user = {
                        id: user.email
                    };
                });

                // create token
                req.token = jwt.sign({
                    id: req.user.id,
                }, SERVER_SECRET, {
                    expiresIn: 120
                });

                // lastly respond with json
                return res.status(200).json({
                    user: req.user,
                    token: req.token
                });
            });
        })(req, res, next);
    });

// =============================================================================

// ==================== Allows users to create accounts ========================

    app.post('/api/auth/signup', passport.authenticate('local-signup', {
        successRedirect : '/api/auth/signup/successjson',
        failureRedirect : '/api/auth/signup/failurejson',
        failureFlash : true
    }));
    // return messages for signup users
    app.get('/api/auth/signup/successjson', function(req, res) {
        res.json({ message: 'Successfully created user' });
    });

    app.get('/api/auth/signup/failurejson', function(req, res) {
        res.json({ message: 'Error create user' });
    });

// =============================================================================

// ================= Protected APIs for authenticated Users ====================
    app.use( expressJwt({
        secret : SERVER_SECRET
    }).unless({
        path:[
            '/api/me'

        ]}
    ));
    app.use(function (err, req, res, next) {
        if (err.name === 'UnauthorizedError') {
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
    });



    app.get('/api/me' ,function(req, res) {
        if(req.isAuthenticated()) {
            res.json({user: req.user});
        }else {
            res.json({message: 'No ton tai user nay;'});
        }
    });

};