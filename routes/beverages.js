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
	let nameBeverage = '';

	if (req.body.bevName.indexOf('|') !== -1) {
		nameBeverage = req.body.bevName.split('|')[0];
		req.body.bevName = req.body.bevName.split('|')[1];

	} else {
		nameBeverage = req.body.bevName;
	}
	const beveragesUpdate = req.body;
  
	connection.query('UPDATE beverages SET ? WHERE bevName = ?', [beveragesUpdate, nameBeverage], err => {
	  if (err) {
		res.status(500).send('Erreur lors de la modification de la boisson');
	  	} else {
			res.sendStatus(200);
	  	};
	});
});

router.delete("/", (req, res) => {
	const bevName = req.query.bevName;
  
	connection.query('DELETE FROM beverages WHERE bevName = ?', [bevName], err => {
		if (err) {
			res.status(500).send("Erreur lors de la suppression d'un dessert");
		} else {
		 res.sendStatus(200);
	   };
	});
});

router.get("/menu", (req, res) => {
	connection.query(`SELECT idBeverages, bevName, CAST((bevPriceHt * taxValue * 100) / 100 AS DECIMAL(16,2)) AS bevPriceTTC ` + 
	`FROM beverages JOIN tax ON beverages.idTax = tax.idTax WHERE bevPriceHt < 3 AND bevName != 'café' ` +
	`AND bevName != 'thé' AND bevName != 'Eau Cristalline 1L'`, (err, results) => {
		if (err) {
			res.status(500).send("Erreur lors de la récupération des boissons pour le menu");
			
		} else {
			res.json(results);
		};
	});
});

module.exports = router;