// src/routes/add.js

import express from "express"
import { config } from "../config.js"
import { sendError } from "../utils/sendError.js"
import { requireBody, validateAllowedFields, validateItemBody } from "../middleware/validators.js"
import supabase from "../utils/db.js"

const tableName = config.moviesTable

const router = express.Router()

router.post("/",
  requireBody,
  validateAllowedFields,
  validateItemBody,
  async (req, res, next) => {

    try {
      console.log("POST /items/", req.body)
      const newItem = req.body

      const { data, error } = await supabase
        .from(tableName)
        .insert(newItem)
        .select()
        .maybeSingle()

      if (error) {
        return next(sendError(
          500,
          "Failed to add item",
          "INSERT_ERROR",
          { underlying: error.message }
        ))
      }

      res.status(201).json({
        ok: true,
        records: 1,
        message: "Item added successfully",
        data: data
      })

    } catch (err) {

      next(err)

    }
  })

export default router