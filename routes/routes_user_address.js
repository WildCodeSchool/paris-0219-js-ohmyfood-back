const express = require("express");
const router = express.Router();
const connection = require("../conf");


router.get("/", (req, res) => {
  res.status(200).send("je suis dans /routes_user_address");
});

router.get("/users_address", (req, res) => {
  const usersProfileAddress = req.body;

  connection.query('SELECT * FROM userAdress', usersProfileAddress, (err, results) => {
    if (err) {
      res.status(500).send("Erreur lors de l'affichage des coordonnées de l'utilisateur");
    } else {
      res.json(results);
    }
  });
  
});

router.post("/users_address", (req, res) => {
  const usersCreateAddress = req.body;

  connection.query('INSERT INTO userAdress SET ?', usersCreateAddress, (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la récupération des coordonnées de l\'utilisateur');
    } else {
      res.json(results);
    }
  });
});

router.put("/users_address", (req, res) => {
  const usersUpdateAddress = req.body;

  connection.query('UPDATE userAdress SET ?', usersUpdateAddress, (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la mise à jour des coordonnées de l\'utilisateur');
    } else {
      res.json(results);
    }
  });
});

router.delete("/users_address/:id", (req, res) => {
  const usersDeleteAddress = req.params.id;

  connection.query('DELETE FROM userAdress WHERE idUserAddress = ?', usersDeleteAddress, (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la suppression des coordonnées de l\'utilisateur');
    } else {
      res.json(results);
    }
  });

});

module.exports = router;
