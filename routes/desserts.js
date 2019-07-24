const express = require("express");
const router = express.Router();
const connection = require("../conf");

router.get("/", (req, res) => {
  connection.query('SELECT idDesserts, dessName, CAST(FLOOR(dessPrice_ht * taxValue * 100) / 100 AS DECIMAL(16,2)) AS dessPriceTTC ' + 
    'FROM desserts JOIN tax ON desserts.idTax = tax.idTax', (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la récupération du dessert');
    } else {
      res.json(results);
    };
  });
});

router.post("/", (req, res) => {
  const dessertsCreate = req.body;

  connection.query('INSERT INTO desserts SET ?', dessertsCreate, (err, results) => {
    if (err) {
      res.status(500).send("Erreur lors de la commande de votre desserts ");
    } else {
      res.sendStatus(200);
    };
  });
});

router.put('/', (req, res) => {
  const dessertName = req.body.dessName; // Get idDesserts
  const dessertsUpdate = req.body; // Get all data

  connection.query('UPDATE desserts SET ? WHERE dessName = ?', [dessertsUpdate, dessertName], err => {
    if (err) {
      res.status(500).send("Erreur lors de la modification d'un dessert");
    } else {
      res.sendStatus(200);
    };
  });
});

router.delete('/', (req, res) => {
  const dessertName = req.query.dessName;

  connection.query('DELETE FROM desserts WHERE dessName = ?', [dessertName], err => {
    if (err) {
      res.status(500).send("Erreur lors de la suppression d'un dessert");
    } else {
      res.sendStatus(200);
    };
  });
});

// Route for menu because there isn't pizza nutella in menus
router.get("/menu", (req, res) => {
	connection.query(`SELECT idDesserts, dessName, CAST((dessPrice_Ht * taxValue * 100) / 100 AS DECIMAL(16,2)) AS dessPriceTTC ` + 
	`FROM desserts JOIN tax ON desserts.idTax = tax.idTax WHERE dessName != 'Pizza Nutella cuite au four'`, (err, results) => {
		if (err) {
			res.status(500).send("Erreur lors de la récupération des desserts pour le menu");
			
		} else {
			res.json(results);
		};
	});
});

module.exports = router;