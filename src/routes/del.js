// src/routes/del.js

import express from "express"
import { config } from "../config.js"
import { sendError } from "../utils/sendError.js";
import { validateId } from "../middleware/validators.js";
import supabase from "../utils/db.js"

const tableName = config.moviesTable

const router = express.Router()

router.delete("/:id",
  validateId,
  async (req, res, next) => {

    try {
      const id = req.params.id
      const removed = await deleteItemById(id)

      if (!removed) {
        return next(sendError(
          404,
          "Item not found",
          "NOT_FOUND",
          { path: req.path, method: req.method }
        ))
      }

      console.log("DELETE /items/id", id)
      res.status(200).json({
        ok: true,
        records: 1,
        message: "Item deleted successfully",
        data: removed
      })
    } catch (err) {
      next(err)
    }
  })

// helper: delete item
export async function deleteItemById(id) {
  const { data: deleted, error } = await supabase
    .from(tableName)
    .delete()
    .eq("id", id)
    .select()
    .maybeSingle()

  if (error) {
    throw sendError(
      500,
      "Error deleting item",
      "DELETE_ERROR",
      { underlying: error.message }
    )
  }

  if (!deleted) {
    return null
  }

  return deleted
}

export default router