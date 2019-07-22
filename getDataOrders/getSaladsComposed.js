const connection = require("../conf");

const sqlRequestSaladsComposed = () => 
    `SELECT orders.idOrders, saladsComposed.idSaladsComposed, GROUP_CONCAT(DISTINCT saladsBaseName, ' ', multiBasesQuantity) AS bases, ` +
    `GROUP_CONCAT(DISTINCT saladsIngredientsName, ' ', multiIngredientsQuantity) AS ingredients, ` +
    `GROUP_CONCAT(DISTINCT saladsToppingsName, ' ', multiToppingsQuantity) AS toppings, ` +
    `saladsSaucesName, saladsComposedPrice, saladsComposedQuantity ` +
    `FROM saladsComposed LEFT JOIN multibases ON multiBases.idSaladsComposed = saladsComposed.idSaladsComposed ` +
    `LEFT JOIN multiIngredients ON multiIngredients.idSaladsComposed = saladsComposed.idSaladsComposed ` +
    `LEFT JOIN multiToppings ON multiToppings.idSaladsComposed = saladsComposed.idSaladsComposed ` +
    `LEFT JOIN saladsSauces ON saladsSauces.idSaladsSauces = saladsComposed.idSaladsSauces ` +
    `LEFT JOIN saladsBase ON saladsBase.idSaladsBase = multiBases.idSaladsBase ` +
    `LEFT JOIN saladsIngredients ON saladsIngredients.idSaladsIngredients = multiIngredients.idSaladsIngredients ` +
    `LEFT JOIN saladsToppings ON saladsToppings.idSaladsToppings = multiToppings.idSaladsToppings ` +
    `LEFT JOIN orders ON orders.idOrders = saladsComposed.idOrders ` +
    `WHERE isMenuSalads IS NULL GROUP BY saladsComposed.idSaladsComposed`;

const getSaladsComposedDetails = () => {
    return new Promise((resolve, reject) => {
            connection.query(sqlRequestSaladsComposed(), (err, results) => {
                if (err) reject([err, "Error from saladsComposed"]);
                resolve(results)
            });
        });
};

module.exports = { getSaladsComposedDetails };