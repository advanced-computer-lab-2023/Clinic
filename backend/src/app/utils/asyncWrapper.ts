import type { NextFunction, Request, Response } from 'express'
import type { ParamsDictionary } from 'express-serve-static-core'

export function asyncWrapper<ReqBody = any>(
  fn: (
    req: Request<ParamsDictionary, any, ReqBody>,
    res: Response,
    next: NextFunction
  ) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err) => {
      next(err)
    })
  }
}
