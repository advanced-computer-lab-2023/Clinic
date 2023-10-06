import * as zod from 'zod'

export const RegisterRequestValidator = zod.object({
  username: zod.string().min(3).max(255),
  password: zod.string().min(6).max(255),
  name: zod.string().min(3).max(255),
  email: zod.string().email(),
  mobileNumber: zod.string().min(10).max(10),
  dateOfBirth: zod.coerce.date(),
  gender: zod.string().min(3).max(255),
  emergencyContact: zod.object({
    emergencyContactName: zod.string().min(3).max(255),
    mobileNumber: zod.string().min(10).max(10),
  }),
})

export const LoginRequestValidator = zod.object({
  username: zod.string().min(1),
  password: zod.string().min(1),
})
