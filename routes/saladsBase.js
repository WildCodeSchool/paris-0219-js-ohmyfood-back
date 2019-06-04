const express = require("express");
const router = express.Router();
const connection = require('../conf');

router.get("/", (req, res) => {

  connection.query('SELECT * FROM saladsBase', (err, results) => {

    if (err) {
      
      // If error, warn user
      res.status(500).send('Erreur lors de la récupération du dessert');
    } else {

      // If all good, send resul as JSON
      res.json(results);
    };
  });
});
// ecoute api //
router.post('/', (req, res) => {

  const formData = req.query

  // connection à la base de doonnée //
  connection.query('INSERT INTO saladsBase SET ?', formData, (err, res)  => {

    if (err) {

      // Si une erreur est survenue, alors on informe l'utilisateurde l'erreur //
      res.status(500).send('Erreur lors de la récupération des données');

    } else {
      // Si tout s'est bien passé, on envoie le résultat de la requête SQL en tant que JSON. //
      res.sendStatus(200);
    }
  });
});
// ecoute api //
router.put('/', (req, res) => {

  const formData = req.query

  // connection à la base de doonnée //
  connection.query('UPDATE  saladsBase SET ?', formData, (err, res)  => {

    if (err) {

      // Si une erreur est survenue, alors on informe l'utilisateurde l'erreur //
      res.status(500).send('Erreur lors de la récupération des données');

    } else {
      // Si tout s'est bien passé, on envoie le résultat de la requête SQL en tant que JSON. //
      res.sendStatus(200);
    }
  });
});
// ecoute api //
router.delete('/', (req, res) => {

  const formData = req.query

  // connection à la base de doonnée //
  connection.query('DELETE FROM saladsBase SET ?', formData, (err, res)  => {

    if (err) {

      // Si une erreur est survenue, alors on informe l'utilisateurde l'erreur //
      res.status(500).send('Erreur lors de la récupération des données');

    } else {
      // Si tout s'est bien passé, on envoie le résultat de la requête SQL en tant que JSON. //
      res.sendStatus(200);
    }
  });
});

module.exports = router
