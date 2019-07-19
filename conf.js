const  mysql = require('mysql');
const  connection = mysql.createConnection({
host :  'localhost',
user :  'root',
password :  'Allen3IversonPHILA76ers',
database :  'ohMyFood'
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = connection;
