const express = require('express');
const router = express.Router();
const connection = require ('../conf');

// body-parser module

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({
	extended: true
}));

router.use(bodyParser.json());

router.get('/', (req, res) => {
	
	connection.query('SELECT * FROM beverages', (err, results) => {

		if (err){
			// answer given to the user in case of an error
			res.status(500).send('Erreur lors de la rcupération de la boisson');
		
		} else {
			// if there is no errors, the result is returned in the JSON format
			res.json(results);
		};
	});
});

router.post('/', (req, res) => {

	// data's recovery
	const formData = req.body;

	// connection into the database and insert beverages
	connection.query('INSERT INTO beverages SET ?', formData, (err, results) => {

		if (err) {
			console.log(err)
			// if an error occurs, we warn the user
			res.status(500).send('Erreur lors de la commande de votre boisson');

		} else {
			// If everything is good, send an OK status
			res.sendStatus(200);
		};
	});
});

router.put('/', (req, res) => {

	// get data
	const id = req.body.idBeverages; // Get idBeverages
	const formData = req.body; // Get all data
  
	connection.query('UPDATE beverages SET ? WHERE idBeverages = ?', [formData, id], err => {
  
	  if (err) {
		
		res.status(500).send('Erreur lors de la modification de la boisson');
	  	} else {
  
			res.sendStatus(200);
	  	};
	});
});

router.delete('/', (req, res) => {

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