const express = require("express");
const router = express.Router();
const connection = require('../conf');

router.get("/", (req, res) => {
  connection.query('SELECT * FROM saladsToppings', (err, results) => {
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
  const id = req.body.saladsToppingsName;
  const updateSaladTop = req.body;

  connection.query('UPDATE saladsToppings SET ? WHERE saladsToppingsName = ?', [updateSaladTop, id], err  => {
    if (err) {
      res.status(500).send('Erreur lors de la mise à jour du topping');
    } else {
      res.sendStatus(200);
    }
  });
});

router.delete('/', (req, res) => {
  const id = req.body.saladsToppingsName
  connection.query('DELETE FROM saladsToppings WHERE saladsToppingsName = ?', [id], (err, results)  => {
    if (err) {
      res.status(500).send('Erreur lors de la suppression du topping');
    } else {
      res.sendStatus(200);
    }
  });
});

module.exports = router;