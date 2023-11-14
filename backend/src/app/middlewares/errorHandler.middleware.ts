import type { ErrorRequestHandler } from 'express'
import { APIError } from '../errors'
import { ZodError } from 'zod'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log(err)

  if (err instanceof APIError) {
    res.status(err.status).json({ message: err.message })
  } else if (err instanceof ZodError) {
    res.status(400).json(err.errors)
  } else if (err != null) {
    res.status(500).json({
      message: err.message ?? 'Internal server error',
    })
  }
}
