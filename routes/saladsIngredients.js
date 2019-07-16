const express = require("express");
const router = express.Router();
const connection = require('../conf');

router.get("/", (req, res) => {
  connection.query('SELECT idSaladsIngredients, saladsIngredientsName, CAST((saladsIngredientsPriceHt * taxValue * 100) / 100 AS DECIMAL(16,2)) AS saladsIngredientsPriceTTC ' + 
  'FROM saladsIngredients JOIN tax ON saladsIngredients.idTax = tax.idTax', (err, results) => {
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
  nameIng = '';

  if (req.body.saladsIngredientsName.indexOf('|') != -1) {
    nameIng = req.body.saladsIngredientsName.split('|')[0];
    req.body.saladsIngredientsName = req.body.saladsIngredientsName.split('|')[1];
  }else{
    nameIng = req.body.saladsIngredientsName;
  }
  const updateSaladIng = req.body;

  connection.query('UPDATE saladsIngredients SET ? WHERE saladsIngredientsName = ?', [updateSaladIng, nameIng], (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la mise à jour des ingrédients');
    } else {
      res.sendStatus(200);
    }
  });
});

router.delete('/', (req, res) => {

  const name = req.query.saladsIngredientsName

  connection.query('DELETE FROM saladsIngredients WHERE saladsIngredientsName = ?', [name], (err, results) => {
    if (err) {
      res.status(500).send("Erreur lors de la suppression de l'ingrédient");
    } else {
      res.sendStatus(200);
    }
  });
});

module.exports = router;