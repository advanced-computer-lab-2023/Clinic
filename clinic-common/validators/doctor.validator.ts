import * as zod from 'zod'

export const UpdateDoctorRequestValidator = zod.object({
  name: zod.string().min(1).optional(),
  email: zod.string().email().optional(),
  dateOfBirth: zod.coerce.date().optional(),
  hourlyRate: zod.number().optional(),
  affiliation: zod.string().min(1).optional(),
  educationalBackground: zod.string().min(1).optional(),
})

export const RegisterDoctorRequestValidator = zod.object({
  username: zod.string().min(3).max(255),
  password: zod.string().min(6).max(255),
  name: zod.string().min(3).max(255),
  email: zod.string().email(),
  mobileNumber: zod.string().min(10).max(10),
  dateOfBirth: zod.coerce.date(),
  hourlyRate: zod.number(),
  affiliation: zod.string().min(1),
  educationalBackground: zod.string().min(1),
  speciality: zod.string().min(1),
})
