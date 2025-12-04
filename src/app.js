// src/app.js

import express from "express"
import cors from "cors"

// utils
import { sendError } from "./utils/sendError.js"

// import routes
import rootRouter from "./routes/root.js"
import readRouter from "./routes/read.js"
import findRouter from "./routes/find.js"
import addRouter from "./routes/add.js"
import delRouter from "./routes/del.js"

const app = express();

app.use(cors())
app.use(express.json());

// use routes
app.use("/", rootRouter)
app.use("/items", readRouter)
app.use("/items", findRouter)
app.use("/items", addRouter)
app.use("/items", delRouter)


app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return next(sendError(400, "Invalid JSON body", "INVALID_JSON"))
  }
  next(err)
})


export function globalErrorHandler(err, req, res, next) {

  const status = err.status || 500
  const code = err.code || "INTERNAL_ERROR"
  const message = err.message || "Server error"

  const payload = {
    ok: false,
    error: {
      status,
      message,
      code
    }
  }

  if (err.details) {
    payload.error.details = err.details
  }

  if (process.env.NODE_env !== "test") {
    console.log("err.stack:", err.stack || err)
  }

  res.status(status).json(payload)
}

export function error404(req, res, next) {
  next(sendError(
    404,
    "Route not found",
    "NOT_FOUND",
    { path: req.path, method: req.method }
  ))
}

// routes error 404
app.use(error404)

// global error handling
app.use(globalErrorHandler)

export default app