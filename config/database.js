
// config/database.js
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:"BookHuby"
});

connection.connect();


module.exports.connection = connection;
