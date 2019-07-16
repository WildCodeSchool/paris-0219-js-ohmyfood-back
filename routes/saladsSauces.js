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
  nameSauce = '';

  if (req.body.saladsSaucesName.indexOf('|') != -1) {
    nameSauce = req.body.saladsSaucesName.split('|')[0];
    req.body.saladsSaucesName = re.body.saladsSaucesName.split('|')[1];
  } else {
    nameSauce = req.body.saladsSaucesName;
  }
  const updateSaladSauces = req.body;

  connection.query('UPDATE saladsSauces SET ? WHERE saladsSaucesName = ? ', [updateSaladSauces, nameSauce], (err, results)  => {
    if (err) {
      res.status(500).send('Erreur lors de la mise à jour de la sauce');
    } else {
      res.sendStatus(200);
    }
  });
});

router.delete('/', (req, res) => {

  const name = req.query.saladsSaucesName;

  connection.query('DELETE FROM saladsSauces WHERE saladsSaucesName = ?', [name], (err, results)  => {
    if (err) {
      res.status(500).send('Erreur lors de la suppression de la sauce');
    } else {
      res.sendStatus(200);
    }
  });
});
module.exports = router;