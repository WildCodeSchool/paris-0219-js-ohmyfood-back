const connection = require("../conf");

const sqlRequestDessertsOrders = (orderId) =>
    `SELECT dessName, dessQuantity FROM dessertsOrders ` + 
    `JOIN desserts ON desserts.idDesserts = dessertsOrders.idDesserts ` +
    `WHERE idOrders = ${orderId} AND isMenuDess IS NULL`;

const getDessertsDetails = (ordersInfos) => {
    return new Promise((resolve, reject) => {
        // Array to get final result
        const result = [];

        // Map to get all infos of according to orders
        ordersInfos.map((orderInfo, i) => {
            connection.query(sqlRequestDessertsOrders(orderInfo.idOrders), (err, results) => {
                if (err) reject([err, "Error from dessertsOrders"]);
                result.push(results)
                if (i + 1 === ordersInfos.length) {
                    resolve(result);
                };
            });
        });
    });
};    

module.exports = { getDessertsDetails };