import * as zod from 'zod'

export const RegisterRequestValidator = zod.object({
  username: zod.string().min(3).max(255),
  password: zod.string().min(6).max(255),
})

export const LoginRequestValidator = zod.object({
  username: zod.string().min(1),
  password: zod.string().min(1),
})
