const express = require("express");
const router = express.Router();
const connection = require("../conf");

router.get("/", (req, res) => {
  connection.query('SELECT idPizzas, pizzName, pizzDesc, CAST((pizzPriceHt * taxValue * 100) / 100 AS DECIMAL(16,2)) AS pizzPriceTTC ' + 
  'FROM pizzas JOIN tax ON pizzas.idTax = tax.idTax', (err, results) => {
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
      res.status(500).send('Erreur lors de la création de la pizza');
    } else {
      res.sendStatus(200);
    };
  });
});

router.put('/', (req, res) => {
  let namePizza = '';

  if (req.body.pizzName.indexOf('|') != -1) {
    namePizza = req.body.pizzName.split('|')[0];
    req.body.pizzName = req.body.pizzName.split('|')[1];
  }else{
    namePizza = req.body.pizzName;
  }
  const pizzasUpdate = req.body;

  connection.query('UPDATE pizzas SET ? WHERE pizzName = ?', [pizzasUpdate, namePizza], err => {
    if (err) {
      res.status(500).send("Erreur lors de la mise à jour de la pizza");
    } else {
      res.sendStatus(200);
    };
  });
});

router.delete("/", (req, res) => {
  const pizzasDelete = req.query.pizzaName;

  connection.query('DELETE FROM pizzas WHERE pizzName = ?', pizzasDelete, (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la suppression de la pizza');
    } else {
      res.sendStatus(200);
    };
  });
});

router.get("/ohMyMardi", (req, res) => {
  connection.query('SELECT CAST((pizzPriceReduc * taxValue * 100) / 100 AS DECIMAL(16,2)) AS pizzPriceReducTTC ' + 
  'FROM ohMyMardi JOIN tax ON ohMyMardi.idtax = tax.idtax', (err, results) => {
    if (err) {
      res.status(500).send("Erreur lors de la récupération du tarif 'ohMyMardi'");
    } else {
      res.json(results);
    };
  });
});

// Get for menu because there isn't pizza de la semaine in menu
router.get("/menu", (req, res) => {
	connection.query(`SELECT idPizzas, pizzName, CAST((pizzPriceHt * taxValue * 100) / 100 AS DECIMAL(16,2)) AS pizzPriceTTC ` + 
	`FROM pizzas JOIN tax ON pizzas.idTax = tax.idTax WHERE pizzName != 'Pizza de la semaine'`, (err, results) => {
		if (err) {
			res.status(500).send("Erreur lors de la récupération des pizzas pour le menu");
			
		} else {
			res.json(results);
		};
	});
});

module.exports = router;
