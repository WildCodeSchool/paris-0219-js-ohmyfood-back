const connection = require("../conf");

// ---------------------------------GET DATA FROM BEVERAGESORDERS TABLE------------------

const sqlRequestBeveragesOrders = () => 
    `SELECT orders.idOrders, bevName, bevQuantity FROM beveragesOrders ` +
    `JOIN beverages ON beverages.idBeverages = beveragesOrders.idBeverages ` + 
    `JOIN orders ON orders.idOrders = beveragesOrders.idOrders ` +
    `WHERE isMenuBev IS NULL`;

const getBeveragesDetails = () => {
    return new Promise((resolve, reject) => {
        connection.query(sqlRequestBeveragesOrders(), (err, results) => {
            if (err) reject([err, "Error from beveragesOrders"]);
            resolve(results);
        });
    });
};

module.exports = { getBeveragesDetails };