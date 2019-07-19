const express = require("express");
const router = express.Router();
const connection = require('../conf');

router.get("/", (req, res) => {
  connection.query('SELECT idSaladsBase, saladsBaseName, CAST((saladsBasePriceHt * taxValue * 100) / 100 AS DECIMAL(16,2)) AS saladsBasePriceTTC ' + 
                    'FROM saladsBase JOIN tax ON saladsBase.idTax = tax.idTax', (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la récupération de la base salade');
    } else {
      res.json(results);
    };
  });
});

router.post('/', (req, res) => {
  const createSaladBase = req.body;

  connection.query('INSERT INTO saladsBase SET ?', createSaladBase, (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la création de la base salade');
    } else {
      res.sendStatus(200);
    }
  });
});

router.put('/', (req, res) => {
  nameBase = '';

  if (req.body.saladsBaseName.indexOf('|') != -1) {
    nameBase = req.body.saladsBaseName.split('|')[0];
    req.body.saladsBaseName = req.body.saladsBaseName.split('|')[1];
  } else {
    nameBase = req.body.saladsBaseName;
  }
  const updateSaladBase = req.body;

  connection.query('UPDATE saladsBase SET ? WHERE saladsBaseName = ?', [updateSaladBase, nameBase], (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la mise à jour de la base salade');
    } else {
      res.sendStatus(200);
    }
  });
});

router.delete('/', (req, res) => {
  const name = req.query.saladsBaseName

  connection.query('DELETE FROM saladsBase WHERE saladsBaseName = ?', [name], (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la suppression de la base salade');
    } else {
      res.sendStatus(200);
    }
  });
});

module.exports = router;
