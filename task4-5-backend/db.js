const mysql = require('mysql2/promise');

let db;

async function getDb() {
  if (!db) {
    db = await mysql.createConnection({
      host: process.env.MYSQLHOST,
      port: process.env.MYSQLPORT,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE
    });
  }
  return db;
}

module.exports = getDb;