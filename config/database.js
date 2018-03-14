
// config/database.js
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Airhuby@2023",
    port: "3306",
    database:"BookHuby"
});

connection.connect();


module.exports.connection = connection;
