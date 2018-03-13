var connection = require('../config/database').connection;
var bcrypt = require('bcrypt-nodejs');
function getUserById (id, callback) {
    connection.query("SELECT * FROM users WHERE user_id = ? ",[id], function(err, rows){
        callback(err, rows[0]);
    });
}


function getUserByEmail(email, callback) {
    connection.query("SELECT * FROM users WHERE email = ?",[email], function(err, rows) {
        callback(err, rows);
    });
}
function setUserToDatabase(newUser, callback) {
    var email = newUser.email;
    var phoneNumber = newUser.phoneNumber;
    var passwordHash = bcrypt.hashSync(newUser.password, null, null);


    var insertQuery = "INSERT INTO users  (email, phone, password) values (?, ?, ?)";

    connection.query(insertQuery,[ email, phoneNumber, passwordHash],function(err, rows) {
        if (err) {
            console.log(err);
        } else {
            var id = rows.insertId;
            callback(err, id);
        }
    });
}

module.exports.getUserById = getUserById;
module.exports.getUserByEmail = getUserByEmail;
module.exports.setUserToDatabase = setUserToDatabase;