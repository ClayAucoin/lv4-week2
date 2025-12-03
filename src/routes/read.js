// src/routes/read.js

import express from "express"
import { sendError } from "../utils/sendError.js"
import supabase from "../utils/db.js"
// import data from "../data.js" // test data

const router = express.Router()

router.get("/", async (req, res, next) => {
  console.log("GET /items")

  // comment to use with test data
  const { data, error } = await supabase
    .from('movies_simple')
    .select('*')

  if (error) {
    return next(sendError(500, error.message, "RETRIEVE_ERROR"))
  }

  res.status(200).json({
    ok: true,
    records: data.length,
    data: data
  })
})

export default router