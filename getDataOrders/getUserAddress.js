const connection = require("../conf");

// ---------------------------------GET USER DETAIL ADRESS------------------------

const sqlRequestUserAddress = userId => 
    `SELECT userAddress1, userAddress2, zipcode, city, userFacturation, userAddressFacturation FROM userAddress ` +
    `WHERE idUsers = ${userId}`;

const userAddressTableData = userId => {
    return new Promise((resolve, reject) => {
        connection.query(sqlRequestUserAddress(userId), (err, results) => {
            if (err) reject([err, 'userAddressTable']);
            resolve(results);
        });
    });
};

module.exports = { userAddressTableData };