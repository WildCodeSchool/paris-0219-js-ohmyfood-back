const express = require("express");
const router = express.Router();
const connection = require ("../conf");

router.post('/', (req, res) => {
	const authInformation = req.body;
		if (err) {
			res.status(500).send('Erreur lors de la création de la  boisson');
		} else {
			res.sendStatus(200);
		};
});

module.exports = router;