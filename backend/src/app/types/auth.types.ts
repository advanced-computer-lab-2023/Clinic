import type { z } from 'zod'
import type {
  LoginRequestValidator,
  RegisterRequestValidator,
} from '../validators/user.validator'

export type RegisterRequest = z.infer<typeof RegisterRequestValidator>

export type LoginRequest = z.infer<typeof LoginRequestValidator>

export class RegisterResponse {
  constructor(public token: string) {}
}

export class LoginResponse {
  constructor(public token: string) {}
}
