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
  const id = req.body.idSaladsBase;
  const updateSaladBase = req.body;

  connection.query('UPDATE saladsBase SET ? WHERE idSaladsBase = ?', [updateSaladBase, id], err => {
    if (err) {
      res.status(500).send('Erreur lors de la mise à jour de la base salade');
    } else {
      res.sendStatus(200);
    }
  });
});

router.delete('/', (req, res) => {
  const id = req.body.idSaladsBase;

  connection.query('DELETE FROM saladsBase WHERE idSaladsBase = ?', [id], err => {
    if (err) {
      res.status(500).send('Erreur lors de la suppression de la base salade');
    } else {
      res.sendStatus(200);
    }
  });
});

module.exports = router;
