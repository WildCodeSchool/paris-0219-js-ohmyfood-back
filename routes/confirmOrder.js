const express = require("express");
const router = express.Router();
const connection = require("../conf");
const getMenuPizz =  require("../getDataOrders/getMenuPizz");
const getOrdersId = require("../getDataOrders/getOrdersId");
const getUserAddress = require("../getDataOrders/getUserAddress");
const getPizzas = require("../getDataOrders/getPizzas");
const getBeverages = require("../getDataOrders/getBeverages");
const getDesserts = require("../getDataOrders/getDesserts");
const getSaladsComposed = require("../getDataOrders/getSaladsComposed");
const getMenuSaladsComposed = require("../getDataOrders/getMenuSalads");

router.get("/", (req, res) => {
  const detailOrderList = [];
  
  // Starting getting informations
  // First from ordersTable
  getOrdersId.ordersTableData()
  .then(ordersInfo => {
    detailOrderList.push(ordersInfo); // Push results in final response which is an array
    
    // Get userAddress informations
    getUserAddress.userAddressTableData()
    .then(userAddressInfos => {
      detailOrderList.push(userAddressInfos) // Push results in final response
      
      // Get Pizzas details
      getPizzas.getPizzasDetails()
      .then(pizzasDetails => {
        detailOrderList.push(pizzasDetails); // Push results in final response
    
        // Get Beverages details
        getBeverages.getBeveragesDetails()
        .then(beveragesDetails => {
          detailOrderList.push(beveragesDetails) // Push results in final response

          // Get Desserts details
          getDesserts.getDessertsDetails()
          .then(dessertsDetails => {
            detailOrderList.push(dessertsDetails); // Push results in final response

            // Get MenuPizz detail
            getMenuPizz.getPizzaMenu()
            .then(detailMenuPizz => {
              detailOrderList.push(detailMenuPizz); // Push results in final response
    
              // Get saladsComposed detail
              getSaladsComposed.getSaladsComposedDetails()
              .then(saladsComposedDetails => {
                detailOrderList.push(saladsComposedDetails) // Push results in final response

                // Get menuSaladsComposed
                getMenuSaladsComposed.getSaladsComposedMenu()
                .then(menuSaladsComposedDetails => {
                  detailOrderList.push(menuSaladsComposedDetails) // Push results in final response

                  // Send final response to front
                  res.json(detailOrderList) 
                });
              });
            });
          });
        });
      });
    });
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

  // Begin general transaction
  connection.beginTransaction( err => {
    if (err) {
      throw err
    }
    // POST orders TABLE
    connection.query(`INSERT INTO orders (dateOrder, orderMessage, orderPrice, userMessage, idUsers, deliveryAddress, facturationAddress) VALUES ` + 
      `('${orderDate}', '${userDetail.deliveryOrTakeAway}', ${orderPrice}, '${userDetail.comment}', ${userDetail.idUsers}, ` + 
      `'${userDetail.livrAddress1} ${userDetail.livrAddress2} ${userDetail.zipcode}', '${userDetail.factAddress}')`, (err, results) => {
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
                  };
                });
              });

              // New Transaction for saladsComposed
              connection.beginTransaction(err => {
                if (err) throw err;
              
              // POST saladsComposed TABLE
              createOrder.salad.map(salad => {
                connection.query(`INSERT INTO saladsComposed (saladsComposedPrice, idSaladsSauces, saladsComposedQuantity, idOrders) VALUES ` +
                `(${salad.saladsComposedPriceTotal}, ${salad.multiSauces.idSaladsSauces}, ${salad.saladsComposedQuantity}, ${orderId})`, (err, results) => {
                  if (err) {
                    return connection.rollback(_ => {
                      res.status(500).send("error from saladsComposed");
                      throw err;
                    });
                  } else {
                      const saladComposedId = results.insertId; // get saladComposedId from post above
                      // POST multiBases TABLE
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
              

                      // POST multiIngredients TABLE
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

                      // POST multiToppings TABLE
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
                  });
                });

                // End of transaction for saladsComposed
                connection.commit( err => {
                  if (err) {
                    return connection.rollback( _ => {
                      res.status(500).send("error from orders");
                      throw err
                    })
                  }
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

              // New transaction for menuPizza
              connection.beginTransaction(err => {
                if (err) throw err;
              
              createOrder.menuPizza.map(menuPizzas => {
                // Update pizzasOrders to know if pizza is in menu or not
                connection.query(`INSERT INTO pizzasOrders (idPizzas, idOrders, pizzasQuantity, isMenuPizz) VALUES ` +
                `(${menuPizzas.pizza.idPizzas}, ${orderId}, ${1}, ${1})`, (err, results) => {
                  if (err) {
                    return connection.rollback(_ => {
                      res.status(500).send("error from menu, update pizzasOrders");
                      throw err;
                    })
                  } else {
                    // Update beveragesOrders to know if beverage is in menu or not
                    connection.query(`INSERT INTO beveragesOrders (idBeverages, idOrders, bevQuantity, isMenuBev) VALUES ` +
                      `(${menuPizzas.beverage.idBeverages}, ${orderId}, ${1}, ${1})`, (err, results) => {
                        if (err) {
                          return connection.rollback(_ => {
                            res.status(500).send("error from menu, update beveragesOrders");
                            throw err;
                          });
                        } else {
                            // Update dessertsOrders to know if dessert is in menu or not
                            connection.query(`INSERT INTO dessertsOrders (idDesserts, idOrders, dessQuantity, isMenuDess) VALUES ` +
                              `(${menuPizzas.dessert.idDesserts}, ${orderId}, ${1}, ${1})`, (err, results) => {
                                  if (err) {
                                    return connection.rollback(_ => {
                                      res.status(500).send("error from menu, update dessertsOrders");
                                      throw err;
                                    });
                                  } else {
                                      connection.query(`INSERT INTO menu (idPizzas, idOrders, idBeverages, idDesserts, menuPizzPrice, menuQuantity) VALUES ` +
                                        `(${menuPizzas.pizza.idPizzas}, ${orderId}, ${menuPizzas.beverage.idBeverages}, ${menuPizzas.dessert.idDesserts}, ` +
                                        `${menuPizzas.menuPizzPriceTotal}, ${menuPizzas.menuPizzQuantity})`, (err, results) => {
                                          if (err) {
                                            return connection.rollback(_ => {
                                              res.status(500).send("Error from menu, pizza");
                                              throw err;
                                            });
                                          };
                                      });
                                    }
                                  });
                              };
                        });
                      };
                    });
                  });
                  // End of transaction for menuPizza
                  connection.commit( err => {
                    if (err) {
                      return connection.rollback( _ => {
                        res.status(500).send("error from orders");
                        throw err
                      });
                    };
                  });
                });
                
                // New transaction for menu Salads
                connection.beginTransaction(err => {
                  if (err) throw err;

                  createOrder.menuSalad.map(menuSalads => {
                    connection.query(`INSERT INTO saladsComposed (saladsComposedPrice, idSaladsSauces, saladsComposedQuantity, idOrders, isMenuSalads) VALUES ` +
                    `(${+menuSalads.salad.orderSaladsPriceTotal}, ${menuSalads.salad.orderSaladsSauces.idSaladsSauces}, ` +
                    `${menuSalads.salad.orderSaladsQuantity}, ${orderId}, ${1})`, (err, results) => {
                      if (err) {
                        return connection.rollback(_ => {
                          res.status(500).send("error from saladsComposed");
                          throw err;
                        });
                      } else {
                          const saladComposedId = results.insertId; // get saladComposedId from post above
                          // POST multiBases TABLE
                          menuSalads.salad.orderSaladsBases.map(bases => {
                            connection.query(`INSERT INTO multiBases (idSaladsBase, idSaladsComposed, multiBasesQuantity) VALUES ` +
                            `(${bases.idSaladsBases}, ${saladComposedId}, ${bases.saladsBasesQuantity})`, (err, results) => {
                                if (err) {
                                  return connection.rollback(_ => {
                                    res.status(500).send("error from multiBases");
                                    throw err;
                                  });
                                };
                              });
                            });

                          // POST multiIngredients TABLE
                          menuSalads.salad.orderSaladsIngredients.map(ingredients => {
                            connection.query(`INSERT INTO multiIngredients (idSaladsIngredients, idSaladsComposed, multiIngredientsQuantity) VALUES ` + 
                            `(${ingredients.idSaladsIngredients}, ${saladComposedId}, ${ingredients.saladsIngredientsQuantity})`, (err, results) => {
                                if (err) {
                                  return connection.rollback(_ => {
                                    res.status(500).send("error from multiIngredients");
                                    throw err;
                                  });
                                };
                              });
                            });
                          // POST multiToppings TABLE
                          menuSalads.salad.orderSaladsToppings.map(toppings => {
                            connection.query(`INSERT INTO multiToppings (idSaladsToppings, idSaladsComposed, multiToppingsQuantity) VALUES ` + 
                            `(${toppings.idSaladsToppings}, ${saladComposedId}, ${toppings.saladsToppingsQuantity})`, (err, results) => {
                                if (err) {
                                  return connection.rollback(_ => {
                                    res.status(500).send("error from multiToppings");
                                    throw err;
                                  });
                                };
                              });
                            });

                          connection.query(`INSERT INTO menu (idOrders, idBeverages, idDesserts, idSaladsComposed, menuSaladPrice, menuQuantity) VALUES ` +
                          `(${orderId}, ${menuSalads.beverage.idBeverages}, ${menuSalads.dessert.idDesserts}, ${saladComposedId}, ` +
                          `${+menuSalads.menuSaladPriceTotal}, ${menuSalads.menuSaladQuantity})`, (err, results) => {
                            if (err) {
                              return connection.rollback(_ => {
                                res.status(500).send("Error from menu, salad");
                                throw err;
                              });
                            };
                          });
                        };
                        // End of transaction for menu Salad
                        connection.commit( err => {
                          if (err) {
                            return connection.rollback( _ => {
                              res.status(500).send("error from orders");
                              throw err
                            });
                          };
                        });
                    });   
                  });
                });
            };       
    });

    // End of all transaction
    connection.commit( err => {
      if (err) {
        return connection.rollback( _ => {
          res.status(500).send("error from orders");
          throw err
        });
      };
    });
    res.status(200).json({ results: "send" });
  });
});


module.exports = router;
