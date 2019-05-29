const express = require("express");
const router = express.Router();
const connection = require("../conf");

// Body parser module

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({
  extended: true
}));

router.use(bodyParser.json());

router.get("/", (req, res) => {
  res.status(200).send("je suis dans /Desserts");
  
});

router.get("/data_desserts", (req, res) => {

  connection.query('SELECT * FROM desserts', (err, results) => {

    if (err) {
      
      // If error, warn user
      res.status(500).send('Erreur lors de la récupération du dessert');
    } else {

      // If all good, send resul as JSON
      res.json(results);
    };
  });
});

router.post("/data_desserts", (req, res) => {

  //data's recovery
  const formData = req.body;

  //connection to database and and insert desserts
  connection.query('INSERT INTO desserts SET ?', formData, (err, results) => {

    if (err) {

      // If error, we warn user
      res.status(500).send("Erreur lors de la commande de votre desserts ");

    } else {
      
      // If all good, send ok status
      res.sendStatus(200);
    }
  });
});

module.exports = router;
