const express = require("express");
const router = express.Router();
const connection = require("../conf");

router.post("/", (req, res) => {
  const authInformation = req.body;
    if (err) {
      res.status(500).send('Erreur lors de la récupération de vos informations');
    } else {
      res.sendStatus(200);
    };
});

module.exports = router;
