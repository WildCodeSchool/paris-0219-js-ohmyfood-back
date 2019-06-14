const  mysql = require('mysql');
const  connection = mysql.createConnection({
host :  'localhost',
user :  'root',
password :  'Volderokh922*Zenta!3',
database :  'ohMyFood'
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = connection;
