import type { ErrorRequestHandler } from 'express'
import { APIError } from '../errors'
import { ZodError } from 'zod'

export const errorHandler: ErrorRequestHandler = (err, req, res) => {
  console.log(err)

  if (err instanceof APIError) {
    res.status(err.status).json({ message: err.message })
  } else if (err instanceof ZodError) {
    res.status(400).json(err.errors)
  } else if (err != null) {
    res.status(500).json({
      message: 'Internal server error',
    })
  }
}
