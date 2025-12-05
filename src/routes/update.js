// src/routes/update.js

import express from "express"
import { config } from "../config.js"
import { sendError } from "../utils/sendError.js"
import { requireBody, validateAllowedFields, validateId, validateItemBody } from "../middleware/validators.js"
import supabase from "../utils/db.js"

const tableName = config.moviesTable

const router = express.Router()

router.put("/:id",
  requireBody,
  validateId,
  validateAllowedFields,
  validateItemBody,
  async (req, res, next) => {

    try {
      console.log("PUT /items/id", req.body)
      const id = req.params.id
      const newItem = req.body

      const { data, error } = await supabase
        .from(tableName)
        .update(newItem)
        .eq('id', id)
        .select()
        .maybeSingle()

      if (error) {
        return next(sendError(
          500,
          "Failed to update item",
          "UPDATE_ERROR",
          { underlying: error.message }
        ))
      }

      res.status(200).json({
        ok: true,
        records: 1,
        message: "Item updated successfully",
        data: data
      })

    } catch (err) {

      next(err)

    }
  })

export default router