const express = require("express")

const router = express.Router()

router.get("/", (req, res) => {
  res.status(200).send("je suis dans /route2")
})

router.get("/sousroute2", (req, res) => {
  res.status(200).send("je suis dans /route2/sousroute2")
})

module.exports = router
