const connection = require("../conf");

// ---------------------------------GET USER DETAIL ADRESS------------------------

const sqlRequestUserAddress = userId => 
    `SELECT orders.idOrders, userAddress1, userAddress2, zipcode, city, userFacturation, userAddressFacturation FROM users ` +
    `JOIN orders ON orders.idUsers = ${userId} ` +
    `JOIN userAddress ON userAddress.idUsers = ${userId}`;

const userAddressTableData = ordersInfos => {
    return new Promise((resolve, reject) => {
        // Get final result in this array
        const result = [];
        
        // Map to get all infos according to orders
        ordersInfos.map((orderInfo, i) => {
            connection.query(sqlRequestUserAddress(orderInfo.idUsers), (err, results) => {
                if (err) reject([err, 'userAddressTable']);
                result.push(results[0]);
                
                if (i + 1 === ordersInfos.length) 
                resolve(result);
            });
        });
    });
};

module.exports = { userAddressTableData };