var jwt = require('jsonwebtoken');
module.exports = function(app, passport, SERVER_SECRET) {


// =========== authenticate login info and generate access token ===============

    app.post('/api/login', function(req, res, next) {
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

    app.post('/api/signup', passport.authenticate('local-signup', {
        successRedirect : '/api/signup/successjson',
        failureRedirect : '/api/signup/failurejson',
        failureFlash : true
    }));
    // return messages for signup users
    app.get('/api/signup/successjson', function(req, res) {
        res.status(200).json({ message: 'Đã tạo tài khoản thành công' });
    });

    app.get('/api/signup/failurejson', function(req, res) {
        res.json({ message: 'Email hoặc Password đã tồn tại' });
    });
    app.get('/api/logout', function(req, res) {
        res.status(200).send({ auth: false, token: null });
    });
}