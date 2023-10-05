import { Request, Response } from "express";

export function login(req: Request, res: Response) {
  res.send("Login!");
}

export function register(req: Request, res: Response) {
  res.send("Register!");
}
