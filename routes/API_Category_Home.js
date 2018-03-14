var jwt = require('jsonwebtoken');
var API = require("../model/API");



module.exports = function(app, passport, SERVER_SECRET) {


    app.get('/api/categories', function(req, res, next) {
        var token = req.headers['x-access-token'];
        if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

        jwt.verify(token, SERVER_SECRET, function(err) {
            if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

            API.getApiCateHome(function (category_arr) {
                res.status(200).send(category_arr);
            });
        });

    });
    app.get('/api/get_book_incategories', function(req, res, next) {
        var token = req.headers['x-access-token'];
        if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

        jwt.verify(token, SERVER_SECRET, function(err) {
            if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
            API.getApiBookInCategory(function (category_arr) {
                res.status(200).send(category_arr);
                // return;
            });
        });

    });

};