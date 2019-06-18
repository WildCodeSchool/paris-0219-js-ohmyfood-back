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
  const createOrder = req.body;
  
  connection.query('INSERT INTO orders SET ?', createOrder, (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la récupération de la commande');
    } else {
      res.sendStatus(200);
    };
  });
});

module.exports = router;
