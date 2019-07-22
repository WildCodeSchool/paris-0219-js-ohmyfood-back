const connection = require("../conf");

// -----------------------------GET ID FROM ORDERS---------------------------

const sqlRequestOrdersTable = () => 
    'SELECT users.idUsers, firstname, lastname, mail, phoneNumber, deliveryAddress, userAddressFacturation, ' +
    'idOrders, dateOrder, orderPrice, userMessage, orderMessage FROM users JOIN orders ON orders.idUsers = users.idUsers ' +
    `JOIN userAddress ON userAddress.idUsers = users.idUsers ` +
    `WHERE archive IS NULL`;

const ordersTableData = () => {
    return new Promise((resolve, reject) => {
        connection.query(sqlRequestOrdersTable(), (err, results) => {
            if (err) reject([err, 'OrdersTable']);
            resolve(results);
        });
    });
};
    
module.exports = { ordersTableData };
