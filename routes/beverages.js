const express = require("express");
const router = express.Router();
const connection = require ("../conf");

router.get("/", (req, res) => {
	connection.query('SELECT idBeverages, bevName, CAST((bevPriceHt * taxValue * 100) / 100 AS DECIMAL(16,2)) AS bevPriceTTC ' + 
									'FROM beverages JOIN tax ON beverages.idTax = tax.idTax', (err, results) => {
		if (err){
			res.status(500).send('Erreur lors de la rcupération de la boisson');
		} else {
			res.json(results);
		};
	});
});

router.post("/", (req, res) => {
	const beveragesCreate = req.body;
	connection.query('INSERT INTO beverages SET ?', beveragesCreate, (err, results) => {
		if (err) {
			res.status(500).send('Erreur lors de la commande de votre boisson');
		} else {
			res.sendStatus(200);
		};
	});
});

router.put("/", (req, res) => {
	const id = req.body.idBeverages; // Get idBeverages
	const beveragesUpdate = req.body; // Get all data
  
	connection.query('UPDATE beverages SET ? WHERE idBeverages = ?', [beveragesUpdate, id], err => {
	  if (err) {
		res.status(500).send('Erreur lors de la modification de la boisson');
	  	} else {
			res.sendStatus(200);
	  	};
	});
});

router.delete("/", (req, res) => {
	const id = req.body.idBeverages;
  
	connection.query('DELETE FROM beverages WHERE idBeverages = ?', [id], err => {
		if (err) {
			res.status(500).send("Erreur lors de la suppression d'un dessert");
		} else {
		 res.sendStatus(200);
	   };
	});
});

module.exports = router;