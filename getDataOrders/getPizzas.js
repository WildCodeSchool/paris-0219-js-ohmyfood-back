const connection = require("../conf");

// --------------------------------GET PIZZAS DETAIL----------------------

const sqlRequestPizzasOrders = () =>
    `SELECT pizzName, pizzasQuantity FROM pizzasOrders ` + 
    `JOIN pizzas ON pizzas.idPizzas = pizzasOrders.idPizzas ` + 
    `JOIN orders ON orders.idOrders = pizzasOrders.idOrders ` +
    `WHERE isMenuPizz IS NULL`;

const getPizzasDetails = () => {
    return new Promise((resolve, reject) => {
        connection.query(sqlRequestPizzasOrders(), (err, results) => {
            if (err) reject([err, "Error from pizzasOrders"]);
            resolve(results);
        });
    });
};

module.exports = { getPizzasDetails };