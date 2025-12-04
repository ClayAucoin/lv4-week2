// src/routes/find.js

import express from "express"
import { sendError } from "../utils/sendError.js"
import { validateId } from "../middleware/validators.js"
import supabase from "../utils/db.js"

const router = express.Router()

router.get("/:id",
  validateId,
  async (req, res, next) => {

    console.log("GET /items/:id", id)
    const id = req.params.id

    const { data, error } = await supabase
      .from('movies_simple')
      .select()
      .eq("id", id)
      .maybeSingle()

    if (error) {
      return next(sendError(
        500,
        error.message,
        "READ_ERROR"
      ))
    }

    if (!data) {
      return next(sendError(
        404,
        "Item not found",
        "NOT_FOUND",
        { path: req.path, method: req.method }
      ))
    }

    const records = data.length
    console.log("records:", records)

    res.status(200).json({
      ok: true,
      records: records,
      data: data
    })
  })

export default router