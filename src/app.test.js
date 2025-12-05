// src/app.error.test.js

import { describe, it, expect, vi } from "vitest"
import request from "supertest"
import express from "express"

import app from "./app.js"
import { globalErrorHandler, error404 } from "./app.js"

const app = express()

describe("globalErrorHandler function", () => {

  it("adds error.details when present", () => {
    const err = new Error("Bad input")
    err.status = 422
    err.code = "VALIDATION_ERROR"
    err.details = { field: "year", value: 1816 }

    const json = vi.fn()
    const status = vi.fn(() => ({ json }))
    const res = { status }
    const req = {}
    const next = vi.fn()

    globalErrorHandler(err, req, res, next)

    expect(status).toHaveBeenCalledWith(422)
    expect(json).toHaveBeenCalledWith({
      ok: false,
      error: {
        status: 422,
        message: "Bad input",
        code: "VALIDATION_ERROR",
        details: { field: "year", value: 1816 }
      }
    })
  })

  it("shows err.stack if not custom app error", () => {
    const err = new Error("Server error")
    err.status = 500
    err.code = "INTERNAL_ERROR"

    const json = vi.fn()
    const status = vi.fn(() => ({ json }))
    const res = { status }
    const req = {}
    const next = vi.fn()

    globalErrorHandler(err, req, res, next)

    expect(status).toHaveBeenCalledWith(500)
    expect(json).toHaveBeenCalledWith({
      ok: false,
      error: {
        status: 500,
        message: "Server error",
        code: "INTERNAL_ERROR",
      }
    })
  })

})

describe("404 handler", () => {

  it("returns 404 when no route matches", async () => {
    app.use(error404)
    app.use(globalErrorHandler)

    const res = await request(app).get("/this-route-does-not-exist")

    expect(res.status).toBe(404)
    expect(res.body.ok).toBe(false)
    expect(res.body.error.code).toBe("NOT_FOUND")
    expect(res.body.error.message).toBe("Route not found")
  })

})
