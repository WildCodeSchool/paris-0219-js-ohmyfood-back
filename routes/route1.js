const express = require("express")

const router = express.Router()

router.get("/", (req, res) => {
  res.status(200).send("je suis dans /route1")
})

router.get("/sousroute1", (req, res) => {
  res.status(200).send("je suis dans /sousroute1")
})

module.exports = router
