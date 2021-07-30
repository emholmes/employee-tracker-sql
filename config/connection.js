const mysql = require("mysql2");

require('dotenv').config()

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: process.env.SQL_PW,
    database: "employee_tracker_db"
  },
  console.log("Connected to the employee tracker db database.")
);

module.exports = db;
