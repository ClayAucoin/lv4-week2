// src/routes/root.js

import express from "express"

const router = express.Router()

router.get("/", (req, res, next) => {
  console.log("GET /")
  let response = "<h1>Express Running</h1>"
  console.log(response)

  res.status(200).send(response)
})

export default router