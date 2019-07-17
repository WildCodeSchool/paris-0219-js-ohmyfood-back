const connection = require("../conf");

// ---------------------------------------GET ID FROM MENU----------------------------- 

const  sqlRequestMenuTable = orderId => 
    `SELECT idOrders, idPizzas, idBeverages, idDesserts, menuPizzPrice, menuQuantity FROM menu ` + 
    `WHERE menu.idOrders = ${orderId} AND idPizzas IS NOT NULL`;

const menuPizzasData = orderId => {
    return new Promise((resolve, reject) => {
        connection.query(sqlRequestMenuTable(orderId), (err, results) => {
            if (err) reject([err, 1]);
            resolve(results);
        });  
    });
};

// ------------------------------------------GET DETAIL MENU------------------

const sqlRequestDetailsMenu = menuPizza => 
    `SELECT pizzName, bevName, dessName FROM menu ` +
    `JOIN pizzas ON pizzas.idPizzas = ${menuPizza.idPizzas} ` +
    `JOIN beverages ON beverages.idBeverages = ${menuPizza.idBeverages} ` +
    `JOIN desserts ON desserts.idDesserts = ${menuPizza.idDesserts} ` +
    `JOIN pizzasOrders ON pizzasOrders.idPizzas = ${menuPizza.idPizzas} ` +
    `JOIN beveragesOrders ON beveragesOrders.idBeverages = ${menuPizza.idBeverages} ` +
    `JOIN dessertsOrders ON dessertsOrders.idDesserts = ${menuPizza.idDesserts} ` +
    `WHERE isMenuPizz IS NOT NULL AND isMenuDess IS NOT NULL AND isMenuBev IS NOT NULL ` +
    `GROUP BY pizzName`;

const detailPizzaMenu = resultsInMenuPizzaData => {
    return new Promise((resolve, reject) => {
        const result = [];
        resultsInMenuPizzaData.map((pizzaMenu, i) => {
            connection.query(sqlRequestDetailsMenu(pizzaMenu), (err, results) => {
                if (err) reject([err, 2]);
                result.push(results[0]);
                if (i === results.length) resolve(result); 
            });
        });
    });
};

module.exports = { detailPizzaMenu, menuPizzasData }