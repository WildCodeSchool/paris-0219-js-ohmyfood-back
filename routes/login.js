const express = require("express");
const router = express.Router();
const connection = require("../conf");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../jwtSecret");
const bcrypt = require("bcrypt");

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
            const token = jwt.sign(userData, jwtSecret, (err, token) => {
                res.json({
                  token,
                  'userMail': results['0'].mail,
                  'userFirstName': results['0'].firstname,
                  'userLastName': results['0'].lastname,
                  'userRight': results['0'].userRight,
                  'userId': results['0'].idUsers
                })
            })
            res.header("Access-Control-Expose-Headers", "x-access-token");
            res.set("x-access-token", token);
            res.status(200);
          }
        })
      }  
    }
  })
})

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
})

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
