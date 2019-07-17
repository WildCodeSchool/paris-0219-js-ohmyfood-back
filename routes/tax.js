const express = require("express");
const router = express.Router();
const connection = require("../conf");

router.get("/", (req, res) => {
  connection.query('SELECT * FROM tax', (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la récupération de la tax');
    } else {
      res.json(results);
    };
  });
});

router.put('/', (req, res) => {
  let nameTax = '';

  if(req.body.idTaxName.indexOf('|') != -1) {
    nameTax = req.body.idTaxName.split('|')[0];
    req.body.idTaxName = req.body.idTaxName.split('|')[1];
  } else {
    nameTax = req.body.idTaxName;
  }
  const taxUpdate = req.body;

  connection.query('UPDATE tax SET ? WHERE idTaxName = ?', [taxUpdate, nameTax], err => {
    if (err) {
      res.status(500).send("Erreur lors de la modification de la tax");
    } else {
      res.sendStatus(200);
    };
  });
});

module.exports = router;