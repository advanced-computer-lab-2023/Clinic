import type { NextFunction, Request, Response } from 'express'
import {
  NotAuthenticatedError,
  NotAuthorizedError,
  TokenError,
} from '../errors/auth.errors'
import {
  isDoctor,
  isAdmin,
  verifyJWTToken,
  isPatient,
  isDoctorAndApproved,
  isDoctorPatientAuthorized,
} from '../services/auth.service'

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization
  if (authHeader == null) {
    next()
    return
  }
  const parts = authHeader.split(' ')
  if (parts.length !== 2) {
    throw new TokenError()
  }
  const [scheme, token] = parts
  if (!/^Bearer$/i.test(scheme)) {
    throw new TokenError()
  }
  const payload = await verifyJWTToken(token)
  req.username = payload.username
  next()
}

export function allowAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req.username == null) {
    throw new NotAuthenticatedError()
  }
  next()
}

export async function allowAdmins(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (req.username == null) {
    throw new NotAuthenticatedError()
  }
  if (await isAdmin(req.username)) {
    next()
    return
  }

  throw new NotAuthorizedError()
}

export async function allowDoctors(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (req.username == null) {
    throw new NotAuthenticatedError()
  }

  if (await isDoctor(req.username)) {
    next()
    return
  }

  throw new NotAuthorizedError()
}

export async function allowApprovedDoctors(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (req.username == null) {
    throw new NotAuthenticatedError()
  }

  if (await isDoctorAndApproved(req.username)) {
    next()
    return
  }

  throw new NotAuthorizedError()
}

export async function allowApprovedDoctorOfPatient(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (req.username == null) {
    throw new NotAuthenticatedError()
  }

  if (await isDoctorPatientAuthorized(req.username, req.params.id)) {
    next()
    return
  }

  throw new NotAuthorizedError()
}

export async function allowPatients(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (req.username == null) {
    throw new NotAuthenticatedError()
  }

  if (await isPatient(req.username)) {
    next()
    return
  }

  throw new NotAuthorizedError()
}
