const express = require("express");
const router = express.Router();
const connection = require('../conf');

router.get("/", (req, res) => {
  connection.query('SELECT * FROM saladsSauces', (err, results) => {
    if (err) {
      console.log(err)
      res.status(500).send('Erreur lors de la récupération');
    } else {
      res.json(results);
    };
  });
});
// ecoute api //

 router.post('/', (req, res) => {

   const formData = req.body
   // connection à la base de doonnée //
   connection.query('INSERT INTO saladsSauces SET ?', formData, (err, results)  => {

     if (err) {

        //Si une erreur est survenue, alors on informe l'utilisateurde l'erreur 
       res.status(500).send('Erreur lors de la récupération des données');

     } else {
       // Si tout s'est bien passé, on envoie le résultat de la requête SQL en tant que JSON. 
       res.sendStatus(200);
     }
   });
 });

 router.put('/', (req, res) => {

   const id = req.body.idSaladsSauces
   const formData = req.body

    //connection à la base de doonnée 
   connection.query('UPDATE saladsSauces SET ? WHERE idSaladsSauces = ? ', [formData, id], (err, results)  => {

     if (err) {

       // Si une erreur est survenue, alors on informe l'utilisateurde l'erreur 
       res.status(500).send('Erreur lors de la récupération des données');

     } else {
      //  Si tout s'est bien passé, on envoie le résultat de la requête SQL en tant que JSON. 
       res.sendStatus(200);
     }
   });
 });
 router.delete('/', (req, res) => {

   const id = req.body.idSaladsSauces

    // connection à la base de doonnée 
   connection.query('DELETE FROM saladsSauces WHERE idSaladsSauces = ?', [id], (err, results)  => {

     if (err) {

        //Si une erreur est survenue, alors on informe l'utilisateurde l'erreur 
       res.status(500).send('Erreur lors de la récupération des données');

     } else {
       // Si tout s'est bien passé, on envoie le résultat de la requête SQL en tant que JSON. 
       res.sendStatus(200);
     }
   });
 });
module.exports = router