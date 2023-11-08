import express, { NextFunction } from 'express'

export const logger = (
  req: express.Request,
  res: express.Response,
  next: NextFunction
) => {
  console.log(`[${req.method}] ${req.url}`)
  console.log(req.body)
  next()
}
