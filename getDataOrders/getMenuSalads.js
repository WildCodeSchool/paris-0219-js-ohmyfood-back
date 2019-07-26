const connection = require("../conf");

const sqlRequestDetailsMenuSaladsComposed = () => 
    `SELECT orders.idOrders, saladsComposed.idSaladsComposed, menuQuantity, menuSaladPrice, `+
    `saladsSaucesName, saladsComposedPrice, saladsComposedQuantity, bevName, dessName, ` +
    `GROUP_CONCAT(DISTINCT saladsBaseName, ' ', multibasesQuantity) AS bases,  ` +
    `GROUP_CONCAT(DISTINCT saladsIngredientsName, ' ', multiIngredientsQuantity) AS ingredients, ` +
    `GROUP_CONCAT(DISTINCT saladsToppingsName, ' ', multiToppingsQuantity) AS toppings ` +
    `FROM menu JOIN saladsComposed ON saladsComposed.idSaladsComposed = menu.idSaladsComposed ` +
    `LEFT JOIN beverages ON beverages.idBeverages = menu.idBeverages ` +
    `LEFT JOIN desserts ON desserts.idDesserts = menu.idDesserts ` +
    `LEFT JOIN multibases ON multibases.idSaladsComposed = saladsComposed.idSaladsComposed ` +
    `LEFT JOIN multiIngredients ON multiIngredients.idSaladsComposed = saladsComposed.idSaladsComposed ` +
    `LEFT JOIN multiToppings ON multiToppings.idSaladsComposed = saladsComposed.idSaladsComposed ` +
    `LEFT JOIN saladsSauces ON saladsSauces.idSaladsSauces = saladsComposed.idSaladsSauces ` +
    `LEFT JOIN saladsBase ON saladsBase.idSaladsBase = multibases.idSaladsBase ` +
    `LEFT JOIN saladsIngredients ON saladsIngredients.idSaladsIngredients = multiIngredients.idSaladsIngredients ` +
    `LEFT JOIN saladsToppings ON saladsToppings.idSaladsToppings = multiToppings.idSaladsToppings ` +
    `LEFT JOIN orders ON orders.idOrders = menu.idOrders ` +
    `WHERE isMenuSalads IS NOT NULL GROUP BY saladsComposed.idSaladsComposed`;

const getSaladsComposedMenu = () => {
    return new Promise((resolve, reject) => {
        connection.query(sqlRequestDetailsMenuSaladsComposed(), (err, results) => {
            if (err) reject([err, "Error from menu saladsComposed"]);
            resolve(results);
        });
    });
};

module.exports = { getSaladsComposedMenu };