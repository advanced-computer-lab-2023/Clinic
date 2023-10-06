import { type ZodSchema } from 'zod'
import type { NextFunction, Request, Response } from 'express'

export function validate<T>(
  validator: ZodSchema<T>
): (req: Request, res: Response, next: NextFunction) => void {
  return (req, res, next) => {
    validator.parse(req.body)
    next()
  }
}
