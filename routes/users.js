const express = require("express");
const router = express.Router();
const connection = require("../conf");
const nodemailer = require("nodemailer");
// Création de la méthode de transport de l'email 
let transporter = nodemailer.createTransport({
  host: 'smtp.mail.gmail.com',
  port: 465,
  service:'gmail',
  secure: false,
  auth: {
      user: "*********",
      pass: "*********"
  }, 
  debug: false,
  logger: true
});

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

  const userData = req.body['0'];
  const userMail = req.body['0'].mail
  const userDataAddress = req.body['1'];
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
          connection.query(`SELECT idUsers FROM users WHERE mail = '${userMail}'`, (err, results) => {
            userDataAddress.idUsers = results['0'].idUsers;
            connection.query('INSERT INTO userAdress SET ?', [userDataAddress], (err, results) => {
              if (err) {
                console.log(err);
                res.status(500).send("Erreur lors de la création de l'utilisateur");
              }
              else {
<<<<<<< HEAD
=======
                transporter.sendMail({
                  from: "OhMyFood", // Expediteur
                  to: userMail, // Destinataires
                  subject: "Création de votre compte", // Sujet
                  text: `Merci d'avoir créé un compte chez OhMyFood, vous pourrez désormais accéder au service de commande en ligne de l'application avec votre adresse mail ${userMail}`, // plaintext body
                }, (error, response) => {
                    if(error){
                        console.log(error);
                    }else{
                        console.log("Message sent: " + response.message);
                    }
                });
>>>>>>> 22c6939cf4f7dd1d37151971951e0a0d7bd9c6b9
                res.sendStatus(200)
              } 
            });
          });
        } 
      });
    } 
  });
});

router.post("/account", (req, res, next) => {
  const userMail = req.body['0'];
  let userId = '';
  let mergeUserAndAdress = '';
  connection.query(`SELECT * FROM users WHERE mail = '${userMail}'`, (err, results) => {
    if(err) {
      console.log(err);
      return res.status(401).send({mess: "Vous n'avez pas accès aux données"});
    }
    userId = results['0'].idUsers
    console.log('result', results)
    connection.query(`SELECT * FROM userAdress WHERE idUsers = '${userId}'`, (err, resultsAdress) => {
      if(err) {
        console.log(err);
        return res.status(401).send({mess: "Vous n'avez pas accès aux données"});
      }
      mergeUserAndAdress = {
        '0': results['0'], 
        '1': resultsAdress['0']
      }
      res.json(mergeUserAndAdress);
      res.status(200)
    })
  })
})


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