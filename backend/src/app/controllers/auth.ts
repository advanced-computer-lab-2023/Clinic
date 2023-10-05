import type { Request, Response } from 'express'

export function login(req: Request, res: Response): void {
  res.send('Login!')
}

export function register(req: Request, res: Response): void {
  res.send('Register!')
}
