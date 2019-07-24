const express = require("express");
const router = express.Router();
const connection = require("../conf");

router.get("/", (req, res) => {
  connection.query('SELECT * FROM menusPrice', (err, results) => {
    if (err) {
      res.status(500).send("Erreur lors de l'affichage du prix des menus");
    } else {
      res.json(results);
    };
  });
});

router.put('/', (req, res) => {
  let menuName = '';
  

  connection.query(`UPDATE menusPrice SET ${menuName} = ?`, [menuName], err => {
    if (err) {
      res.status(500).send("Erreur lors de la modification du prix du menu");
    } else {
      res.sendStatus(200);
    };
  });
});

module.exports = router;