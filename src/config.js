// src/config.js

import dotenv from "dotenv"

dotenv.config()

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseKey: process.env.SUPABASE_ANON_KEY || "",
  moviesTable: process.env.MOVIES_TABLE || "movies_simple",
}