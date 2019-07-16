const express = require("express");
const router = express.Router();
const connection = require("../conf");

router.get("/", (req, res) => {
  connection.query('SELECT * FROM orders', (err, results) => {
    if (err) {
      res.status(500).send("Erreur lors de l'affichage de la commande");
    } else {
      res.json(results);
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
            const saladComposedId = results.insertId; // Get saladComposedId from post above

            // POST multiBases TABLE
            for (const salad of createOrder.salad) {
              salad.multiBases.map(bases => {
                connection.query(`INSERT INTO multiBases (idSaladsBase, idSaladsComposed, multiBasesQuantity) VALUES ` +
                `(${bases.idSaladsBase}, ${saladComposedId}, ${bases.multiBasesQuantity})`, (err, results) => {
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
              salad.multiIngredients.map(ingredients => {
                connection.query(`INSERT INTO multiIngredients (idSaladsIngredients, idSaladsComposed, multiIngredientsQuantity) VALUES ` + 
                `(${ingredients.idSaladsIngredients}, ${saladComposedId}, ${ingredients.multiIngredientsQuantity})`, (err, results) => {
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
              salad.multiToppings.map(toppings => {
                connection.query(`INSERT INTO multiToppings (idSaladsToppings, idSaladsComposed, multiToppingsQuantity) VALUES ` + 
                `(${toppings.idSaladsToppings}, ${saladComposedId}, ${toppings.multiToppingsQuantity})`, (err, results) => {
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
            createOrder.salad.map(saladComposedOrder => {
              connection.query(`INSERT INTO saladsComposedOrders (idSaladsComposed, idOrders, saladsComposedQuantity) VALUES ` + 
              `(${saladComposedId}, ${orderId}, ${saladComposedOrder.saladsComposedQuantity})`, (err, results) => {
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
