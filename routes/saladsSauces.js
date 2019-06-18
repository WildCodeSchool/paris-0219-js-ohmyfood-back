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
  const id = req.body.idSaladsSauces;
  const updateSaladSauces = req.body;

  connection.query('UPDATE saladsSauces SET ? WHERE idSaladsSauces = ? ', [updateSaladSauces, id], (err, results)  => {
    if (err) {
      res.status(500).send('Erreur lors de la mise à jour de la sauce');
    } else {
      res.sendStatus(200);
    }
  });
});

router.delete('/', (req, res) => {
  const id = req.body.idSaladsSauces;

  connection.query('DELETE FROM saladsSauces WHERE idSaladsSauces = ?', [id], (err, results)  => {
    if (err) {
      res.status(500).send('Erreur lors de la suppression de la sauce');
    } else {
      res.sendStatus(200);
    }
  });
});
module.exports = router;