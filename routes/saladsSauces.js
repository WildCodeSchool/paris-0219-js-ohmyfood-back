const express = require("express");
const router = express.Router();
const connection = require('../conf');

router.get("/", (req, res) => {
  connection.query('SELECT * FROM saladsSauces', (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la récupération des sauces');
    } else {
      res.json(results);
    };
  });
});

router.post('/', (req, res) => {
  const createSaladSauces = req.body;

  connection.query('INSERT INTO saladsSauces SET ?', createSaladSauces, (err, results)  => {
    if (err) {
      res.status(500).send('Erreur lors de la création de la sauce');
    } else {
      res.sendStatus(200);
    }
  });
});

router.put('/', (req, res) => {
  const name = req.body.saladsSaucesName;
  const updateSaladSauces = req.body;

  connection.query('UPDATE saladsSauces SET ? WHERE saladsSaucesName = ? ', [updateSaladSauces, name], (err, results)  => {
    if (err) {
      res.status(500).send('Erreur lors de la mise à jour de la sauce');
    } else {
      res.sendStatus(200);
    }
  });
});

router.delete('/', (req, res) => {
  const name = req.body.saladsSaucesName;

  connection.query('DELETE FROM saladsSauces WHERE saladsSaucesName = ?', [name], (err, results)  => {
    if (err) {
      res.status(500).send('Erreur lors de la suppression de la sauce');
    } else {
      res.sendStatus(200);
    }
  });
});
module.exports = router;