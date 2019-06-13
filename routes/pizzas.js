const express = require("express");
const router = express.Router();
const connection = require("../conf");

router.get("/", (req, res) => {
  connection.query('SELECT idPizzas, pizzName, CAST((pizzPriceHt * taxValue * 100) / 100 AS DECIMAL(16,2)) AS pizzPriceTTC ' + 
  'FROM pizzas JOIN tax ON pizzas.idTax = tax.idTax', (err, results) => {
    if (err) {
      res.status(500).send("Erreur lors de l'affichage des pizzas");
    } else {
      res.json(results);
    };
  });
});

router.post("/", (req, res) => {
  console.log(req.body)
  const pizzasCreate = req.body;
  console.log(pizzasCreate)
  
  connection.query('INSERT INTO pizzas SET ?', pizzasCreate, (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la création de la pizza');
    } else {
      res.sendStatus(200);
    };
  });
});

router.put('/', (req, res) => {
  const id = req.body.idPizzas; // Get idDesserts
  const pizzasUpdate = req.body; // Get all data

  connection.query('UPDATE pizzas SET ? WHERE idPizzas = ?', [pizzasUpdate, id], err => {
    if (err) {
      res.status(500).send("Erreur lors de la mise à jour de la pizza");
    } else {
      res.sendStatus(200);
    };
  });
});

router.delete("/", (req, res) => {
  const pizzasDelete = req.body.id;

  connection.query('DELETE FROM pizzas WHERE idPizzas = ?', pizzasDelete, (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la suppression de la pizza');
    } else {
      res.sendStatus(200);
    };
  });
});

module.exports = router;
