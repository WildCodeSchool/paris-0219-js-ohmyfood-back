const  mysql = require('mysql');
const  connection = mysql.createConnection({
host :  'localhost',
user :  'root',
<<<<<<< HEAD
password :  'needkama',
=======
password :  '',
>>>>>>> b78a9304305b2d204714bb654c791e240c59662b
database :  'ohMyFood'
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = connection;
