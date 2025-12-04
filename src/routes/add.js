// src/routes/add.js

import express from "express"
import { validateRequiredFields, validateItemBody } from "../middleware/validators.js"
import { sendError } from "../utils/sendError.js"
import supabase from "../utils/db.js"

const router = express.Router()
router.use(express.json());
router.use(express.urlencoded({ extended: true }))

router.post("/", validateRequiredFields, validateItemBody, async (req, res, next) => {
  console.log("POST /items", req.body)
  const newItem = req.body

  try {
    const { data, error } = await supabase
      .from('movies_simple')
      .insert(newItem)
      .select()
      .single()

    if (error) return next(sendError(500, error.message, "INSERT_ERROR", { underlying: error }))

    res.status(201).json({
      ok: true,
      message: "Item added successfully",
      data: data
    })
  } catch (err) {
    next(sendError(500, "Failed to add item", "WRITE_ERROR"))
  }
})

export default router