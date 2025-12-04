// src/routes/del.js

import express from "express"
import { validateId } from "../middleware/validators.js";
import { sendError } from "../utils/sendError.js";
import supabase from "../utils/db.js"
// import data from "../data.js" // test data

const router = express.Router()
router.use(express.json());

router.delete("/:id", validateId, async (req, res, next) => {
  console.log("DELETE /items")

  try {
    const id = req.params.id
    const removed = await deleteItemById(id)

    if (!removed) {
      return next(sendError(404, "Movie not found", "NOT_FOUND"))
    }

    res.status(200).json({
      ok: true,
      message: "Movie deleted successfully",
      data: removed
    })
  } catch (err) {
    next(err)
  }
})

// helper: delete movie
export async function deleteItemById(id) {
  const { data: deleted, error } = await supabase
    .from("movies_simple")
    .delete()
    .eq("id", id)
    .select()
    .maybeSingle()

  if (error) {
    throw sendError(500, "Error deleting item", "DELETE_ERROR", { underlying: error.message })
  }

  if (!deleted) {
    return null
  }

  return deleted
}

export default router