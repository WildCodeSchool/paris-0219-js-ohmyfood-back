const connection = require("../conf");

// ---------------------------------GET USER DETAIL ADRESS------------------------

const sqlRequestUserAddress = () => 
    `SELECT orders.idOrders, userAddress1, userAddress2, zipcode, city, userFacturation FROM users ` +
    `JOIN orders ON orders.idUsers = users.idUsers ` +
    `JOIN userAddress ON userAddress.idUsers = users.idUsers`;

const userAddressTableData = () => {
    return new Promise((resolve, reject) => {        
        connection.query(sqlRequestUserAddress(), (err, results) => {
            if (err) reject([err, 'userAddressTable']);
            resolve(results);
        });
    });
};

module.exports = { userAddressTableData };