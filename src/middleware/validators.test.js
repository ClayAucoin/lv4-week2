// src/utils/validators.test.js

import { describe, it, expect, vi } from "vitest"
import { requireBody, validateId, validateItemBody, validateAllowedFields } from "./validators.js"
import { sendError } from "../utils/sendError.js"

describe("requireBody middleware", () => {

  it("returns 400 when body is missing", () => {
    const req = { body: undefined }
    const res = {}
    const next = vi.fn()

    requireBody(req, res, next)

    const [err] = next.mock.calls[0]
    expect(err.status).toBe(400)
    expect(err.code).toBe("MISSING_BODY")
  })
})

describe("validateId middleware function", () => {

  it("succeeds with valid UUID", () => {
    const req = { params: { id: "fab588e9-ef4b-4b03-b5a4-d6ffbf83bf9f" } }
    const res = {}
    const next = vi.fn()

    validateId(req, res, next)

    const [err] = next.mock.calls[0]
  })

  it("calls next with error when contains invalid hex chars", () => {
    const req = { params: { id: "gdeb27fb-d9a0-4624-be4d-3f0f73ff12c5" } }
    const res = {}
    const next = vi.fn()

    validateId(req, res, next)

    const [err] = next.mock.calls[0]
    expect(err.status).toBe(422)
    expect(err.code).toBe("INVALID_ID")
    expect(err.details.value).toBe("gdeb27fb-d9a0-4624-be4d-3f0f73ff12c5")
  })

  it("calls next with error when not valid - missing hyphens", () => {
    const req = { params: { id: "ddeb27fbd9a04624be4d3f0f73ff12c5" } }
    const res = {}
    const next = vi.fn()

    validateId(req, res, next)

    const [err] = next.mock.calls[0]
    expect(err.status).toBe(422)
    expect(err.code).toBe("INVALID_ID")
    expect(err.details.value).toBe("ddeb27fbd9a04624be4d3f0f73ff12c5")
  })

  it("calls next with error when not 4 in the 13th position", () => {
    const req = { params: { id: "ddeb27fb-d9a0-1624-be4d-3f0f73ff12c5" } }
    const res = {}
    const next = vi.fn()

    validateId(req, res, next)

    const [err] = next.mock.calls[0]
    expect(err.status).toBe(422)
    expect(err.code).toBe("INVALID_ID")
    expect(err.details.value).toBe("ddeb27fb-d9a0-1624-be4d-3f0f73ff12c5")
  })

  it("calls next with error when 17th char not valid", () => {
    const req = { params: { id: "ddeb27fb-d9a0-4624-ce4d-3f0f73ff12c5" } }
    const res = {}
    const next = vi.fn()

    validateId(req, res, next)

    const [err] = next.mock.calls[0]
    expect(err.status).toBe(422)
    expect(err.code).toBe("INVALID_ID")
    expect(err.details.value).toBe("ddeb27fb-d9a0-4624-ce4d-3f0f73ff12c5")
  })

})

describe("validateItemBody middleware", () => {

  it("returns 422 when imdb_id is malformed", () => {
    const req = { body: { imdb_id: "t9214772", title: "Test Movie", year: 2020 } }
    const res = {}
    const next = vi.fn()

    validateItemBody(req, res, next)

    const [err] = next.mock.calls[0]
    expect(err.status).toBe(422)
    expect(err.code).toBe("INVALID_IMDB_ID")
    expect(err.details.field).toBe("imdb_id")
    expect(err.details.value).toBe("t9214772")
  })

  it("returns 422 when title is missing", () => {
    const req = { body: { imdb_id: "tt9214772", year: 2020 } }
    const res = {}
    const next = vi.fn()

    validateItemBody(req, res, next)

    const [err] = next.mock.calls[0]
    expect(err.status).toBe(422)
    expect(err.code).toBe("VALIDATION_ERROR")
    expect(err.details.missing).toContain("title")
  })

  it("returns 422 when year is missing", () => {
    const req = { body: { imdb_id: "tt9214772", title: "Test Movie" } }
    const res = {}
    const next = vi.fn()

    validateItemBody(req, res, next)

    const [err] = next.mock.calls[0]
    expect(err.status).toBe(422)
    expect(err.code).toBe("VALIDATION_ERROR")
    expect(err.details.missing).toContain("year")
  })

  it("returns 422 when imdb_id is missing", () => {
    const req = { body: { title: "Test Movie", year: 2020 } }
    const res = {}
    const next = vi.fn()

    validateItemBody(req, res, next)

    const [err] = next.mock.calls[0]
    expect(err.status).toBe(422)
    expect(err.code).toBe("VALIDATION_ERROR")
    expect(err.details.missing).toContain("imdb_id")
  })

  it("returns 422 when year is not a number", () => {
    const req = { body: { imdb_id: "tt9214772", title: "Test", year: "2020" } }
    const res = {}
    const next = vi.fn()

    validateItemBody(req, res, next)

    const [err] = next.mock.calls[0]
    expect(err.status).toBe(422)
    expect(err.code).toBe("INVALID_TYPE")
    expect(err.details.field).toBe("year")
    expect(err.details.value).toBe("2020")
  })

  it("returns 422 when year < 1900", () => {
    const req = { body: { imdb_id: "tt9214772", title: "Old Movie", year: 1816 } }
    const res = {}
    const next = vi.fn()

    validateItemBody(req, res, next)

    const [err] = next.mock.calls[0]
    expect(err.status).toBe(422)
    expect(err.code).toBe("INVALID_VALUE")
    expect(err.details.field).toBe("year")
    expect(err.details.value).toBe(1816)
  })


  it("calls next() with no error when body is valid", () => {
    const req = { body: { imdb_id: "tt9214772", title: "Valid Movie", year: 2020 } }
    const res = {}
    const next = vi.fn()

    validateItemBody(req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
    const [err] = next.mock.calls[0]
    expect(err).toBeUndefined()
  })

})


describe("validateAllowedFields middleware", () => {

  it("rejects unexpected extra fields", () => {
    const req = {
      body: {
        id: 1,
        title: "Test",
        year: 2020,
        foo: "bar",
        junk: 123
      }
    }

    const res = {}
    const next = vi.fn()

    validateAllowedFields(req, res, next)

    const [err] = next.mock.calls[0]
    expect(err.status).toBe(422)
    expect(err.code).toBe("EXTRA_FIELDS")
    expect(err.details.extra).toEqual(["id", "foo", "junk"])
  })

})