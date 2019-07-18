const connection = require("../conf");

// ---------------------------------GET DATA FROM BEVERAGESORDERS TABLE------------------

const sqlRequestBeveragesOrders = (orderId) => 
    `SELECT bevName, bevQuantity FROM beveragesOrders ` +
    `JOIN beverages ON beverages.idBeverages = beveragesOrders.idBeverages ` + 
    `WHERE idOrders = ${orderId} AND isMenuBev IS NULL`;

const getBeveragesDetails = (ordersInfos) => {
    return new Promise((resolve, reject) => {
        // To get final results
        const result = [];

        // Map to get all infos of according to orders
        ordersInfos.map((orderInfo, i) => {
            connection.query(sqlRequestBeveragesOrders(orderInfo.idOrders), (err, results) => {
                if (err) reject([err, "Error from beveragesOrders"]);
                result.push(results);
                if (i + 1 === ordersInfos.length)
                resolve(result);
            });
        })
    });
};

module.exports = { getBeveragesDetails };