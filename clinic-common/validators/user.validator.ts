import * as zod from 'zod'

export const RegisterRequestValidator = zod.object({
  username: zod.string().min(3).max(255).regex(/^[a-zA-Z0-9_]+$/),
  password: zod.string().min(6).max(255),
  name: zod.string().min(3).max(255),
  email: zod.string().email(),
  mobileNumber: zod.string().min(11).max(11),
  dateOfBirth: zod.coerce.date(),
  gender: zod.string().min(3).max(255),
  emergencyContact: zod.object({
    name: zod.string().min(3).max(255),
    mobileNumber: zod.string().min(11).max(11),
  }),
})

export const LoginRequestValidator = zod.object({
  username: zod.string().min(1),
  password: zod.string().min(1),
})

