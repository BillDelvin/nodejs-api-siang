const mysql = require("mysql2");

const conn = mysql.createPool({
  user: "root",
  password: "bill1234",
  host: "localhost",
  database: "kampus_merdeka",
});

module.exports = conn;
