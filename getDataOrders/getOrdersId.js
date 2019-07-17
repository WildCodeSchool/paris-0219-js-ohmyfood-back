const connection = require("../conf");

// -----------------------------GET ID FROM ORDERS---------------------------

const sqlRequestOrdersTable = () => 
    'SELECT users.idUsers, firstname, lastname, mail, phoneNumber, ' +
    'idOrders, dateOrder, orderPrice, userMessage FROM users JOIN orders ON orders.idUsers = users.idUsers';

const ordersTableData = () => {
    return new Promise((resolve, reject) => {
        connection.query(sqlRequestOrdersTable(), (err, results) => {
            if (err) reject([err, 'OrdersTable']);
            resolve(results);
        });
    });
};
    
module.exports = { ordersTableData };
