import express, { NextFunction } from 'express'

export const logger = (
  req: express.Request,
  res: express.Response,
  next: NextFunction
) => {
  // Ignore socket.io requests
  if (req.url.startsWith('/socket.io')) {
    return next()
  }

  console.log(`[${req.method}] ${req.url}`)
  console.log(req.body)
  next()
}
