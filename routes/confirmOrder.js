const express = require("express");
const router = express.Router();
const connection = require("../conf");

router.get("/", (req, res) => {
  const detailOrderList = [];

  connection.query('SELECT users.idUsers, firstname, lastname, mail, phoneNumber, idOrders, dateOrder, orderPrice, userMessage FROM users JOIN orders ON orders.idUsers = users.idUsers', (err, results) => {
    if (err) {
      res.status(500).send("Erreur lors de l'affichage de la commande");
    } else {
      detailOrderList.push(results[0]);
      const userId = results[0].idUsers;
      connection.query(`SELECT userAddress1, userAddress2, zipcode, city, userFacturation, userAddressFacturation FROM userAdress WHERE idUsers = ${userId}`, (err, results) => {
        if (err) {
          res.status(500).send("Erreur lors de l'affichage des adresses");
        } else {
          detailOrderList.push(results[0]);

          //pizzas
          connection.query(`SELECT pizzName, pizzasQuantity FROM pizzasOrders JOIN pizzas ON pizzas.idPizzas = pizzasOrders.idPizzas JOIN orders ON orders.idOrders = pizzasOrders.idOrders`, (err, results) => {
            if (err) {
              res.status(500).send("Erreur lors de l'affichage des pizzas");
            } else {
              detailOrderList.push(results);
            }
          });
          //beverages
          connection.query(`SELECT bevName, bevQuantity FROM beveragesOrders JOIN beverages ON beverages.idBeverages = beveragesOrders.idBeverages JOIN orders ON orders.idOrders = beveragesOrders.idOrders`, (err, results) => {
            if (err) {
              res.status(500).send("Erreur lors de l'affichage des boissons");
            } else {
              detailOrderList.push(results);
            }
          });
          // desserts
          connection.query(`SELECT dessName, dessQuantity FROM dessertsOrders JOIN desserts ON desserts.idDesserts = dessertsOrders.idDesserts JOIN orders ON orders.idOrders = dessertsOrders.idOrders`, (err, results) => {
            if (err) {
              res.status(500).send("Erreur lors de l'affichage des desserts");
            } else {
              detailOrderList.push(results);
            };
          });
          // salads
          connection.query(`SELECT saladsComposed.idSaladsSauces, saladsComposed.idSaladsComposed, saladsComposedQuantity, saladsComposedPrice FROM saladsComposedOrders ` +
           `JOIN saladsComposed ON saladsComposed.idSaladsComposed = saladsComposedOrders.idSaladsComposed ` + 
           `JOIN orders ON orders.idOrders = saladsComposedOrders.idOrders`, (err, results) => {
             if (err) {
               res.status(500).send(results);
             } else {
               console.log(results);
               connection.query(``, (err, results) => {

               });
             };
           });
        };
      });
      res.status(200).send(detailOrderList);
    };
  });
});

router.post("/", (req, res) => {
  const createOrder = req.body[0];
  const userMail = req.body[1].mailUser;
  const userDetail = req.body[1];
  const orderDate = req.body[2].dateOrder;
  const orderPrice = req.body[2].priceOrder
  connection.query(`SELECT idUsers FROM users WHERE mail = '${userMail}'`, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      userDetail.idUsers = results['0'].idUsers;
    }
  })

  connection.beginTransaction( err => {
    if (err) {
      throw err
    }

    // POST orders TABLE
    connection.query(`INSERT INTO orders (dateOrder, orderMessage, orderPrice, userMessage, idUsers) VALUES ` + 
      `('${orderDate}', 'Merci d avoir commandé chez Ohmyfood', ${orderPrice}, '${userDetail.comment}', ${userDetail.idUsers})`, (err, results) => {
          if (err) {
            return connection.rollback(_ => {
              res.status(500).send("error from orders");
              throw err;
            });

          } else {
            const orderId = results.insertId; // Get orderId from post above

            // POST pizzasOrders TABLE
            createOrder.pizza.map(pizz => {
              connection.query(`INSERT INTO pizzasOrders (idOrders, pizzasQuantity, idPizzas) VALUES ` + 
            `(${orderId}, ${pizz.pizzQuantity}, ${pizz.idPizzas})`, (err, results) => {
              if (err) {
                return connection.rollback(_ => {
                  res.status(500).send("error from pizzasOrder");
                  throw err;
                });
              }
              });
            })

            // POST saladsComposed TABLE
            createOrder.salad.map(salad => {
              connection.query(`INSERT INTO saladsComposed (saladsComposedPrice, idSaladsSauces) VALUES ` +
              `(${salad.saladsComposedPriceTotal}, ${salad.multiSauces.idSaladsSauces})`, (err, results) => {
                if (err) {
                  return connection.rollback(_ => {
                    res.status(500).send("error from saladsComposed");
                    throw err;
                  });
                };        
              });
            });

            // POST multiBases TABLE
            for (const salad of createOrder.salad) {
              salad.multiBases.map((bases, i) => {
                connection.query(`INSERT INTO multiBases (idSaladsBase, idSaladsComposed, multiBasesQuantity) VALUES ` +
                `(${bases.idSaladsBase}, ${i + 1}, ${bases.multiBasesQuantity})`, (err, results) => {
                  if (err) {
                    return connection.rollback(_ => {
                      res.status(500).send("error from multiBases");
                      throw err;
                    });
                  };
                });
              });
            };

            // POST multiIngredients TABLE
            for (const salad of createOrder.salad) {
              salad.multiIngredients.map((ingredients, i) => {
                connection.query(`INSERT INTO multiIngredients (idSaladsIngredients, idSaladsComposed, multiIngredientsQuantity) VALUES ` + 
                `(${ingredients.idSaladsIngredients}, ${i + 1}, ${ingredients.multiIngredientsQuantity})`, (err, results) => {
                  if (err) {
                    return connection.rollback(_ => {
                      res.status(500).send("error from multiIngredients");
                      throw err;
                    });
                  };
                });
              });
            };

            // POST multiToppings TABLE
            for (const salad of createOrder.salad) {
              salad.multiToppings.map((toppings, i) => {
                connection.query(`INSERT INTO multiToppings (idSaladsToppings, idSaladsComposed, multiToppingsQuantity) VALUES ` + 
                `(${toppings.idSaladsToppings}, ${i + 1}, ${toppings.multiToppingsQuantity})`, (err, results) => {
                  if (err) {
                    return connection.rollback(_ => {
                      res.status(500).send("error from multiToppings");
                      throw err;
                    });
                  };
                });
              });
            };

            // POST saladsComposedOrders
            createOrder.salad.map((saladComposedOrder, i) => {
              connection.query(`INSERT INTO saladsComposedOrders (idSaladsComposed, idOrders, saladsComposedQuantity) VALUES ` + 
              `(${i + 1}, ${orderId}, ${saladComposedOrder.saladsComposedQuantity})`, (err, results) => {
                if (err) {
                  return connection.rollback(_ => {
                    res.status(500).send("error from saladsComposedOrders");
                    throw err;
                  });
                };
              });
            });

            createOrder.beverage.map(beverages => {
              connection.query(`INSERT INTO beveragesOrders (idOrders, idBeverages, bevQuantity) VALUES ` + 
              `(${orderId}, ${beverages.idBeverages}, ${beverages.bevQuantity})`, (err, results) => {
                if (err) {
                  return connection.rollback(_ => {
                    res.status(500).send("error from beveragesOrders");
                    throw err;
                  });
                };
              });
            });

            createOrder.dessert.map(desserts => {
              connection.query(`INSERT INTO dessertsOrders (idDesserts, idOrders, dessQuantity) VALUES ` + 
              `(${desserts.idDesserts}, ${orderId}, ${desserts.dessQuantity})`, (err, results) => {
                if (err) {
                  return connection.rollback(_ => {
                    res.status(500).send("error from dessertsOrders");
                    throw err;
                  });
                };
              });
            });

            createOrder.menuPizza.map(menuPizzas => {
              connection.query(`INSERT INTO menu (idPizzas, idOrders, idBeverages, idDesserts, menuPizzPrice, menuQuantity) VALUES ` +
              `(${menuPizzas.pizza.idPizzas}, ${orderId}, ${menuPizzas.beverage.idBeverages}, ${menuPizzas.dessert.idDesserts}, ${menuPizzas.menuPizzPriceTotal}, ${menuPizzas.menuPizzQuantity})`, (err, results) => {
                if (err) {
                  return connection.rollback(_ => {
                    res.status(500).send("Error from menu, pizza");
                    throw err;
                  });
                };
              });
            });
            
            createOrder.menuSalad.map((menuSalads, i) => {
              connection.query(`INSERT INTO menu (idOrders, idBeverages, idDesserts, idSaladsComposed, menuSaladPrice, menuQuantity) VALUES ` +
              `(${orderId}, ${menuSalads.beverage.idBeverages}, ${menuSalads.dessert.idDesserts}, ${i + 1}, ${menuSalads.menuSaladPriceTotal}, ${menuSalads.menuSaladQuantity})`, (err, results) => {
                if (err) {
                  return connection.rollback(_ => {
                    res.status(500).send("Error from menu, salad");
                    throw err;
                  });
                };
              });
            });
          };
        });

        connection.commit( err => {
          if (err) {
            return connection.rollback( _ => {
              res.status(500).send("error from orders");
              throw err
            })
          }
        })
        res.status(200).json({ results: "send" });
  })
});

module.exports = router;
