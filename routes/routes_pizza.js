const express = require("express");
const router = express.Router();
const connection = require("../conf");


router.get("/", (req, res) => {
  res.status(200).send("je suis dans /routes_pizzas");
});

router.get("/pizzas", (req, res) => {
  const pizzasOrders = req.body;

  connection.query('SELECT * FROM pizzasOrders', pizzasOrders, (err, results) => {
    if (err) {
      res.status(500).send("Erreur lors de l'affichage des pizzas");
    } else {
      res.json(results);
    }
  });
  
});

router.post("/pizzas", (req, res) => {
  const pizzasOrders = req.body;

  connection.query('INSERT INTO pizzasOrders SET ?', pizzasOrders, (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la récupération des pizzas');
    } else {
      res.json(results);
    }
  });
});

module.exports = router;
