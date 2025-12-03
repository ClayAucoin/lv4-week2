// src/routes/find.js

import express from "express"
import { sendError } from "../utils/sendError.js"
import { validateId } from "../middleware/validators.js"
import supabase from "../utils/db.js"
// import data from "../data.js" // test data

const router = express.Router()
router.use(express.json());

router.get("/:id", async (req, res, next) => {
  console.log("GET /items/id")
  console.log("id:", req.params, "typeof:", typeof req.params)

  const id = req.params.id

  // const movie = data.find((entry) => entry.id === id)

  // comment to use with test data
  const { data, error } = await supabase
    .from('movies_simple')
    .select('*')
    .eq("id", id)
    .maybeSingle();

  if (!data) {
    return next(sendError(404, "Item not found", "NOT_FOUND"))
  }

  res.status(200).json({
    ok: true,
    data: data
  })
})

export default router