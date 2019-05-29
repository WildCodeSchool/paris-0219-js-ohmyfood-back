const express = require("express");
const router = express.Router();
const connection = require("../conf");


router.get("/", (req, res) => {
  res.status(200).send("je suis dans /routes_user");
});

router.get("/users", (req, res) => {
  const usersProfile = req.body;

  connection.query('SELECT * FROM users', usersProfile, (err, results) => {
    if (err) {
      res.status(500).send("Erreur lors de l'affichage de l'utilisateur");
    } else {
      res.json(results);
    }
  });
  
});

router.post("/users", (req, res) => {
  const usersCreate = req.body;

  connection.query('INSERT INTO users SET ?', usersCreate, (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la récupération de l\'utilisateur');
    } else {
      res.json(results);
    }
  });
});

module.exports = router;
