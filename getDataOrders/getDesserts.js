const connection = require("../conf");

const sqlRequestDessertsOrders = () =>
    `SELECT orders.idOrders, dessName, dessQuantity FROM dessertsOrders ` + 
    `JOIN desserts ON desserts.idDesserts = dessertsOrders.idDesserts ` +
    `JOIN orders ON orders.idOrders = dessertsOrders.idOrders ` +
    `WHERE isMenuDess IS NULL`;

const getDessertsDetails = () => {
    return new Promise((resolve, reject) => {
        connection.query(sqlRequestDessertsOrders(), (err, results) => {
            if (err) reject([err, "Error from dessertsOrders"]);  
            resolve(results);
        });
    });
};    

module.exports = { getDessertsDetails };