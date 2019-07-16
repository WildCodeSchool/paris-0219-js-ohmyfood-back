const express = require("express");
const router = express.Router();
const connection = require('../conf');

router.get("/", (req, res) => {
  connection.query('SELECT idSaladsToppings, saladsToppingsName, CAST((saladsToppingsPriceHt * taxValue * 100) / 100 AS DECIMAL(16,2)) AS saladsToppingsPriceTTC ' + 
  'FROM saladsToppings JOIN tax ON saladsToppings.idTax = tax.idTax', (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la récupération des toppings');
    } else {
      res.json(results);
    };
  });
});

router.post('/', (req, res) => {
  const createSaladTop = req.body;

  connection.query('INSERT INTO saladsToppings SET ?', createSaladTop, (err, results)  => {
    if (err) {
      res.status(500).send('Erreur lors de la création du topping');
    } else {
      res.sendStatus(200);
    }
  });
});

router.put('/', (req, res) => {
  nameTop = '';

  if (req.body.saladsToppingsName.indexOf('|') != -1) {
    nameTop = req.body.saladsToppingsName.split('|')[0];
    req.body.saladsToppingsName = req.body.saladsToppingsName.split('|')[1];
  } else {
    nameTop = req.body.saladsToppingsName;
  }
  const updateSaladTop = req.body;

  connection.query('UPDATE saladsToppings SET ? WHERE saladsToppingsName = ?', [updateSaladTop, nameTop], err  => {
    if (err) {
      res.status(500).send('Erreur lors de la mise à jour du topping');
    } else {
      res.sendStatus(200);
    }
  });
});

router.delete('/', (req, res) => {
  
  const name = req.query.saladsToppingsName

  connection.query('DELETE FROM saladsToppings WHERE saladsToppingsName = ?', [name], (err, results)  => {
    if (err) {
      res.status(500).send('Erreur lors de la suppression du topping');
    } else {
      res.sendStatus(200);
    }
  });
});

module.exports = router;