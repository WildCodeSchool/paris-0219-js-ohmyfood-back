const express = require("express");
const router = express.Router();
const connection = require("../conf");

router.get("/", (req, res) => {
  connection.query('SELECT * FROM pizzas', (err, results) => {
    if (err) {
      res.status(500).send("Erreur lors de l'affichage des pizzas");
    } else {
      res.json(results);
    };
  });
});

router.post("/", (req, res) => {
  const pizzasCreate = req.body;
  
  connection.query('INSERT INTO pizzas SET ?', pizzasCreate, (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la récupération des pizzas');
    } else {
      res.sendStatus(200);
    };
  });
});

router.delete("/", (req, res) => {
  const pizzasOrdersDelete = req.body.id;

  connection.query('DELETE FROM pizzas WHERE idPizzas = ?', pizzasOrdersDelete, (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la récupération des pizzas');
    } else {
      res.sendStatus(200);
    };
  });
});

module.exports = router;
