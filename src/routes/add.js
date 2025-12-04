// src/routes/add.js

import express from "express"
import { sendError } from "../utils/sendError.js"
import { requireBody, validateAllowedFields, validateItemBody } from "../middleware/validators.js"
import supabase from "../utils/db.js"

const router = express.Router()

router.post("/",
  requireBody,
  validateAllowedFields,
  validateItemBody,
  async (req, res, next) => {

    console.log("POST /items/", req.body)
    const newItem = req.body

    try {
      const { data, error } = await supabase
        .from('movies_simple')
        .insert(newItem)
        .select()
        .single()

      if (error) {
        return next(sendError(
          500,
          error.message,
          "INSERT_ERROR",
          { underlying: error.message }
        ))
      }

      res.status(201).json({
        ok: true,
        records: data.length,
        message: "Item added successfully",
        data: data
      })

    } catch (err) {

      next(sendError(
        500,
        "Failed to add item",
        "WRITE_ERROR",
        { underlying: error.message }
      ))
    }
  })

export default router