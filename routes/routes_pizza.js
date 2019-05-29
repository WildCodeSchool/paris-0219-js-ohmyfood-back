const express = require("express");
const router = express.Router();
const connection = require("../conf");

router.get("/", (req, res) => {
  res.status(200).send("je suis dans /routes_pizzas");
});

router.post("/pizzas", (req, res) => {
  connection.query(
    `INSERT INTO pizzasOrders(idOrders) SELECT idOrders FROM orders ORDER BY idOrders DESC LIMIT 1
    INSERT INTO pizzasOrders(idPizzas) SELECT `
    , (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la récupération des pizzas');
    } else {
      res.json(results);
    }
  });
});

module.exports = router;
