const express = require("express");
const router = express.Router();
const connection = require("../conf");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../jwtSecret");

// Création de la méthode de transport de l'email 
let transporter = nodemailer.createTransport({
  host: 'smtp.mail.gmail.com',
  port: 465,
  service:'gmail',
  secure: false,
  auth: {
    user: "*****",
    pass: "*****"
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

  connection.query(`SELECT mail FROM users WHERE mail = '${userMail}'`, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la vérification de l'email");
    } else if (results.length > 0) {
      console.log("L'email existe déjà");
      res.json({response: "Cet email existe déjà"});
      res.status(409, 'L\'email existe déja dans la base de donnée')
    } 
    else {
      // User bcrypt package to crypt user password
      bcrypt.hash(userData.password, 10, (err, hash) => {
        userData.password = hash; // Hash user password
        if (err) {
          res.send('error ', err)
        }
        payload = {
          "mail": userMail,
          "password": userData.password,
        }
        const token = jwt.sign(payload, jwtSecret, (err, token) => {
          userData.forgotPassword = token;
          connection.query('INSERT INTO users SET ?', userData, (err, results) => {
            if (err) {
              console.log(err);
              res.status(500).send("Erreur lors de la création de l'utilisateur");
            }
            else {
              connection.query(`SELECT idUsers FROM users WHERE mail = '${userMail}'`, (err, results) => {
                userDataAddress.idUsers = results['0'].idUsers;
                connection.query('INSERT INTO userAddress SET ?', [userDataAddress], (err, results) => {
                  if (err) {
                    console.log(err);
                    res.status(500).send("Erreur lors de la création de l'utilisateur");
                  }
                  else {
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
                    res.sendStatus(200)
                  } 
                });
              });
            } 
          });
        });
      })
    } 
  });
});

router.post("/account", (req, res) => {
  const userMail = req.body['0'];
  let userId = '';
  let mergeUserAndAdress = '';
  connection.query(`SELECT * FROM users WHERE mail = '${userMail}'`, (err, results) => {
    if(err) {
      console.log(err);
      return res.status(401).send({mess: "Vous n'avez pas accès aux données"});
    }
    userId = results['0'].idUsers
    
    connection.query(`SELECT * FROM userAddress WHERE idUsers = '${userId}'`, (err, resultsAdress) => {
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


router.put('/account/user', (req, res) => {
  const userMail = req.body.mail
  const userUpdate = req.body;
  let password = req.body.password;
  if (password != undefined) {
    delete req.body.psswVerif;
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        res.send('error ', err)
      } else {
        password = hash; // Hash user password
        payload = {
          "mail": userMail,
          "password": password,
        }
          jwt.sign(payload, jwtSecret, (err, token) => {
            connection.query(`UPDATE users SET password = '${password}', forgotPassword = '${token}' WHERE mail = '${userMail}'`, (err, results) => {
              if (err) {
                res.status(500).send("L'insertion du mot de passe a échouée")
              } else {
                delete req.body.password
              }
          });
        });
      }
    });
  }
  connection.query(`UPDATE users SET ? WHERE mail = '${userMail}'`, userUpdate, err => {
    if (err) {
      res.status(500).send("Erreur lors de la mise à jour de l'utilisateur");
    } else {      
      res.json({res: 'response'});
      res.status(200)
    };
  });
});

router.put('/account/userAddress', (req, res) => {
  const userMail = req.body[1].mail
  const userAddressUpdate = req.body[0];
  connection.query(`SELECT idUsers FROM users WHERE mail='${userMail}'`, (err, results) => {
    if (err) {
      res.status(500).send("Erreur lors de la mise à jour des adresses utilisateur");
    } else {
      idUser = results[0].idUsers;
      connection.query(`UPDATE userAddress SET ? WHERE idUserAddress = ${idUser}`, userAddressUpdate, err => {
        if (err) {
          res.status(500).send("Erreur lors de la mise à jour des adresses utilisateur");
        } else {
          res.sendStatus(200);
        }
      });
    }
  });
});

router.delete("/account", (req, res) => {
  const userMail = req.query.mail;
  
  connection.query(`SELECT idUsers FROM users WHERE mail = '${userMail}'`, (err, results) => {
    if (err) {
      res.status(500).send("L'utilisateur est introuvable")
    } else {
      idUser = results[0].idUsers
      connection.query(`DELETE FROM userAddress WHERE idUsers = ${idUser}`, err => {
        if (err) {
          res.status(500).send("Erreur lors de la suppression des adresses utilisateurs");
        } else {
          connection.query(`DELETE FROM users WHERE mail = '${userMail}'`, err => {
            if (err) {
              res.status(500).send("Erreur lors de la suppression de l'utilisateur")
            } else {
              res.sendStatus(200)
            }
          }) 
        };
      });
    }
  });
});

module.exports = router