// src/routes/add.js

import express from "express"
import { validateItemBody } from "../middleware/validators.js"
import { sendError } from "../utils/sendError.js"
import { randomUUID } from 'node:crypto'
import supabase from "../utils/db.js"
// import data from "../data.js" // test data

const router = express.Router()
router.use(express.json());
router.use(express.urlencoded({ extended: true }))

router.post("/", validateItemBody, async (req, res, next) => {
  console.log("POST /items", req.body)
  const newMovie = req.body
  const newItem = { ...req.body, id: randomUUID() }

  console.log("newItem", newItem)

  // to use with test data
  // data.push(newMovie)

  const { data, error } = await supabase
    .from('movies_simple')
    .insert(newItem)

  res.status(200).json({
    ok: true,
    message: "Item added successfuly",
    data: newMovie
  })
})

export default router