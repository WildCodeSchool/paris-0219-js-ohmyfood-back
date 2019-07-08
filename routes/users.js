const express = require("express");
const router = express.Router();
const connection = require("../conf");

router.get("/", (req, res) => {
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      res.status(500).send("Erreur lors de l'affichage des informations de l'utilisateur");
    } else {
      res.json(results);
    };
  });
});

router.post("/", (req, res) => {

  const userData = req.body;
  const userMail = req.body.mail
  console.log('userMail', userData.mail)

  connection.query(`SELECT mail FROM users WHERE mail = '${userMail}'`, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la vérification de l'email");
    } else if (results.length > 0) {
      console.log("L'email existe déjà")
      res.status(409, 'L\'email existe déja dans la base de donnée')
    } 
    else {
      connection.query('INSERT INTO users SET ?', [userData], (err, results) => {
        if (err) {
          console.log(err);
          res.status(500).send("Erreur lors de la création de l'utilisateur");
        }
        else {
          console.log(results)
          res.sendStatus(200)
        } 
      });
    } 
  });
});


router.put('/', (req, res) => {
  const firstNameUser = req.body.firstname;
  const lastNameUser = req.body.lastname;
  const userUpdate = req.body;

  connection.query('UPDATE users SET ? WHERE firstname = ? AND lastname = ?', [userUpdate, firstNameUser, lastNameUser], err => {
    if (err) {
      res.status(500).send("Erreur lors de la mise à jour de l'utilisateur");
    } else {
      res.sendStatus(200);
    };
  });
});

router.delete("/", (req, res) => {
  const mailUser = req.body.mail;

  connection.query('DELETE FROM users WHERE mail = ?', [mailUser], (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la suppression de la pizza');
    } else {
      res.sendStatus(200);
    };
  });
});

module.exports = router