// src/routes/read.js

import express from "express"
import { sendError } from "../utils/sendError.js"
import supabase from "../utils/db.js"

const router = express.Router()

router.get("/", async (req, res, next) => {

  const { data, error } = await supabase
    .from('movies_simple')
    .select()

  if (error) {
    return next(sendError(
      500,
      error.message,
      "READ_ERROR",
      { underlying: error.message }
    ))
  }

  const records = data.length
  console.log(`GET /items/ ${records} records`)
  res.status(200).json({
    ok: true,
    records: records,
    data: data
  })
})

export default router