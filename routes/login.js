const express = require("express");
const router = express.Router();
const connection = require("../conf");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../jwtSecret");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');

// Création de la méthode de transport de l'email 
let transporter = nodemailer.createTransport({
  host: 'smtp.mail.gmail.com',
  port: 465,
  service:'gmail',
  secure: false,
  auth: {
      user: "forbidden.soul81@gmail.com",
      pass: "dblI125ok*/gitmyfriend"
  }, 
  debug: false,
  logger: true
});

router.post("/", (req, res) => {
  const userData = req.body;
  const userPssw = req.body.password;
  const userMail = req.body.mail;

  connection.query(`SELECT password FROM users WHERE mail = '${userMail}'`, (err, results) => {
    if (results.length === 0) {
      res.status(401).send("Vous n'avez pas de compte");
    }

    if (err) {
      res.send('error ' + err);

    } else {

      // User bcrypt to compare input password and password in database OR check password if it's not crypt
      if (bcrypt.compareSync(userPssw, results[0].password) || userPssw === results[0].password) {
        connection.query(`SELECT firstname, lastname, mail, password, userRight FROM users WHERE mail = '${userMail}' AND password = '${results[0].password}'`, (err, results) => {
          if(err) {
            res.send('error ', err);
          } else {
            console.log("user recognized");
            payload = {
              "mail": userMail,
              "password": userData.password,
            }
            const token = jwt.sign(payload, jwtSecret, (err, token) => {
                res.json({
                  token,
                  'userMail': results['0'].mail,
                  'userFirstName': results['0'].firstname,
                  'userLastName': results['0'].lastname,
                  'userRight': results['0'].userRight,
                  'userId': results['0'].idUsers
                });
            });
            res.header("Access-Control-Expose-Headers", "x-access-token");
            res.set("x-access-token", token);
            res.status(200);
          }
        });
      }  
    }
  });
});

// vérifier le token pour les pages protégées 

router.post("/protected", (req, res, next) => {
  const token = verifToken(req);
  const objectTests = { //data appelées par la bdd 
    test: 'ok',
  }
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if(err) {
      console.log(err);
      return res.status(401).send({mess: "Vous n'avez pas accès aux données"});
    }
    console.log('decode',decoded);
    return res.status(200).send({mess: 'User Datas', objectTests });
  })
});

router.post("/forgottenPassword", (req, res) => {
  const userMail = req.body.userMail;

  connection.query(`SELECT mail, forgotPassword FROM users WHERE mail = '${userMail}'`, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la vérification de l'email");
    } else {
      transporter.sendMail({
        from: "OhMyFood", // Expediteur
        to: userMail, // Destinataires
        subject: "Récupération de votre mot de passe", // Sujet
        text: `Ce mail vous est destiné dans le cas où vous avez fait une demande de nouveau mot de passe. Cliquez sur le lien suivant pour continuer la procédure : 
        http://localhost:4200/TzApeyaNpBzRJmGrit59K4NJ5Cy/${results[0].forgotPassword}
          Dans le cas où vous n'avez pas fait cette demande, contactez l'équipe d'OhMyFood pour que ceux-ci puissent résoudre le problème le plus rapidement possible.
        `, // plaintext body
      }, (error, response) => {
          if(error){
              console.log(error);
          }else{
              console.log("Message sent: " + response.message);
          }
      });
    }
  });
});

router.post("/TzApeyaNpBzRJmGrit59K4NJ5Cy", (req, res) => {
  const userToken = req.body.token
  connection.query(`SELECT forgotPassword FROM users WHERE forgotPassword = '${userToken}'`, (err, results) => {
    if (err) {
      res.status(500).send("Le token ne correspond pas")
    } else if (results.length == 0){
      res.status(401).send("Le token ne correspond pas")
    } else { 
      res.json({token: `${userToken}`})
      res.status(200)
    }
  });
});

// Verify token function

const verifToken = req => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
};

module.exports = router;
