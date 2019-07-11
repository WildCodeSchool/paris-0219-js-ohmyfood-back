const express = require("express");
const router = express.Router();
const connection = require("../conf");

router.get("/", (req, res) => {
    connection.query('SELECT * FROM menuPrices', (err, results) => {
      if (err) {
        res.status(500).send("Erreur lors de l'affichage du prix des menus");
      } else {
        res.json(results);
      };
    });
  });

module.exports = router;