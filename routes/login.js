const express = require("express");
const router = express.Router();
const connection = require("../conf");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../jwtSecret");

router.post("/", (req, res) => {
  const userData = req.body;
  const userMail = req.body.mail;
  const userPssw = req.body.password;

  connection.query(`SELECT mail FROM users WHERE mail = '${userMail}'`, (err, results) => {

    if (results.length === 0) {
      res.status(401).send("Vous n'avez pas de compte");
    } else {
      connection.query(`SELECT firstname, lastname, mail, password FROM users WHERE mail = '${userMail}' AND password = '${userPssw}'`, (err, results) => {
        if(results[0].password.length === 0) {
          console.error(err);
          res.status(401).send("Wrong password");
        } else {
          console.log("user recognized");
          const token = jwt.sign(userData, jwtSecret, (err, token) => {
              res.json({
                token
              })
          })
          console.log(results.body)
          res.header("Access-Control-Expose-Headers", "x-access-token");
          res.set("x-access-token", token);
          res.status(200);
        }
      })
    }
  })
})

// vérifier le token pour les pages protégées 

router.post("/protected", (req, res, next) => {
  console.log('protectCall')
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
