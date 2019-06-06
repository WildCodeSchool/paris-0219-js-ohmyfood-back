const express = require("express");
const router = express.Router();
const connection = require("../conf");

// Body parser module
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({
  extended: true })
);

router.use(bodyParser.json());

router.get("/", (req, res) => {
  connection.query('SELECT * FROM desserts', (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la récupération du dessert');
    } else {
      res.json(results);
    };
  });
});

router.post("/", (req, res) => {
  const formData = req.body;

  connection.query('INSERT INTO desserts SET ?', formData, (err, results) => {
    if (err) {
      res.status(500).send("Erreur lors de la commande de votre desserts ");
    } else {
      res.sendStatus(200);
    };
  });
});

router.put('/', (req, res) => {
  const id = req.body.idDesserts; // Get idDesserts
  const formData = req.body; // Get all data

  connection.query('UPDATE desserts SET ? WHERE idDesserts = ?', [formData, id], err => {
    if (err) {
      res.status(500).send("Erreur lors de la modification d'un dessert");
    } else {
      res.sendStatus(200);
    };
  });
});

router.delete('/', (req, res) => {
  const id = req.body.idDesserts;

  connection.query('DELETE FROM desserts WHERE idDesserts = ?', [id], err => {
    if (err) {
      res.status(500).send("Erreur lors de la suppression d'un dessert");
    } else {
      res.sendStatus(200);
    };
  });
});

module.exports = router;
