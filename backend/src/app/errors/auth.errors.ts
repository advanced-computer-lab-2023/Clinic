import { APIError } from '.'

export class LoginError extends APIError {
  constructor() {
    super('Username or password not correct', 400)
  }
}

export class UsernameAlreadyTakenError extends APIError {
  constructor() {
    super('Username already taken', 400)
  }
}

export class EmailAlreadyTakenError extends APIError {
  constructor() {
    super('Email is used before', 400)
  }
}

export class TokenError extends APIError {
  constructor() {
    super('Token error', 401)
  }
}

export class NotAuthenticatedError extends APIError {
  constructor() {
    super('Not authenticated', 401)
  }
}

export class NotAuthorizedError extends APIError {
  constructor() {
    super('You are not authorized to access this resource', 403)
  }
}
