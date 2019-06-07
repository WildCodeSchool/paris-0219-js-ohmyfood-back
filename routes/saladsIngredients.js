const express = require("express");
const router = express.Router();
const connection = require('../conf');

router.get("/", (req, res) => {
  connection.query('SELECT * FROM saladsIngredients', (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la récupération des ingrédients');
    } else {
      res.json(results);
    };
  });
});

router.post('/', (req, res) => {
  const createSaladIng = req.body;

  connection.query('INSERT INTO saladsIngredients SET ?', createSaladIng, (err, results) => {
    if (err) {
      res.status(500).send("Erreur lors de la création de l'ingrédient");
    } else {
      res.sendStatus(200);
    }
  });
});

router.put('/', (req, res) => {
  const id = req.body.idSaladsIngredients;
  const updateSaladIng = req.body;

  connection.query('UPDATE saladsIngredients SET ? WHERE idSaladsIngredients = ?', [updateSaladIng, id], (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la mise à jour des ingrédients');
    } else {
      res.sendStatus(200);
    }
  });
});

router.delete('/', (req, res) => {
  const id = req.body.idSaladsIngredients

  connection.query('DELETE FROM saladsIngredients WHERE idSaladsIngredients = ?', [id], (err, results) => {
    if (err) {
      res.status(500).send("Erreur lors de la suppression de l'ingrédient");
    } else {
      res.sendStatus(200);
    }
  });
});

module.exports = router;