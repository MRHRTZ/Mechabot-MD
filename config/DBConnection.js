const path = require('path')
require('dotenv').config({ path: (path.join(__dirname, '../../.env')) })

var mysql = require('mysql');

const Constant = {
    host: process.env.host,
    user: process.env.user,
    password: process.env.pass,
    database: process.env.database,
}

var db = mysql.createConnection(Constant);

// db.connect(function(err) {
//     if (err) throw err;
//     console.log("Database connected!");
// });

module.exports = { db, Constant }