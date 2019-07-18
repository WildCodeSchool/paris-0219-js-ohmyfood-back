const connection = require("../conf");

// ---------------------------------GET USER DETAIL ADRESS------------------------

const sqlRequestUserAddress = userId => 
    `SELECT userAddress1, userAddress2, zipcode, city, userFacturation, userAddressFacturation FROM userAddress ` +
    `WHERE idUsers = ${userId}`;

const userAddressTableData = orderInfo => {
    return new Promise((resolve, reject) => {
        // Get final result in this array
        const result = [];

        // Map to get all infos according to orders
        orderInfo.map((ordersInfos, i) => {
            connection.query(sqlRequestUserAddress(ordersInfos.idUsers), (err, results) => {
                if (err) reject([err, 'userAddressTable']);
                result.push(results[0]);
                if (i === results.length) resolve(result);
            });
        });
    });
};

module.exports = { userAddressTableData };