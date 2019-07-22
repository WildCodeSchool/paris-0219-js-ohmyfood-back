const connection = require("../conf");

// ------------------------------------------GET DETAIL MENU------------------

const sqlRequestDetailsMenuPizz = () => 
    `SELECT orders.idOrders, pizzName, bevName, dessName, menuQuantity, menuPizzPrice FROM menu `+
    `JOIN pizzas ON pizzas.idPizzas = menu.idPizzas ` +
    `JOIN beverages ON beverages.idBeverages = menu.idBeverages ` +
    `JOIN desserts ON desserts.idDesserts = menu.idDesserts ` + 
    `JOIN orders ON orders.idOrders = menu.idOrders ` +
    `WHERE menu.idPizzas IS NOT NULL`;

const getPizzaMenu = () => {
    return new Promise((resolve, reject) => {
        connection.query(sqlRequestDetailsMenuPizz(), (err, results) => {
            if (err) reject([err, "Error from menuPizzas"]);        
            resolve(results); 
        });
    });
};

module.exports = { getPizzaMenu };