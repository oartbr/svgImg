const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.MYSQL_IP,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  // If using SSL
  // ssl: {
  //   // Necessary SSL certs and options
  // }
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log('Connected as id ' + connection.threadId);
});

// Close the MySQL connection
connection.end();