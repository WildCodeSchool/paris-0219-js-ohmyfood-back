const connection = require("../conf");

// --------------------------------GET PIZZAS DETAIL----------------------

const sqlRequestPizzasOrders = (orderId) =>
    `SELECT pizzName, pizzasQuantity FROM pizzasOrders ` +
    `JOIN pizzas ON pizzas.idPizzas = pizzasOrders.idPizzas ` + 
    `WHERE idOrders = ${orderId} AND isMenuPizz IS NULL`

const getPizzasDetails = (ordersInfos) => {
    return new Promise((resolve, reject) => {
        // Array to get final result
        const result = [];

        // Map to get all infos of according to orders
        ordersInfos.map((orderInfo, i) => {
            connection.query(sqlRequestPizzasOrders(orderInfo.idOrders), (err, results) => {
                if (err) reject([err, "Error from pizzasOrders"]);
                result.push(results)
                if (i + 1 === ordersInfos.length) {
                    resolve(result);
                };
            });
        });
        
    });
};

module.exports = { getPizzasDetails };