import { z } from 'zod'

// Common schema for all steps
export const CommonSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  username: z.string().min(3).max(30),
  password: z
    .string()
    .min(8)
    .refine(
      (password: any) => {
        const hasLowercase = /[a-z]/.test(password)
        const hasUppercase = /[A-Z]/.test(password)
        const hasDigit = /\d/.test(password)
        const hasSymbol = /[!@#$%^&*()_+{}[\]:;<>,.?~\\-]/.test(password)

        return hasLowercase && hasUppercase && hasDigit && hasSymbol
      },
      {
        message:
          'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character.',
      }
    ),
  dateOfBirth: z.date(),
  hourlyRate: z.number().optional(),
  affiliation: z.string().min(1).optional(),
  educationalBackground: z.enum([
    'Associate degree',
    "Bachelor's degree",
    "Master's degree",
    'Doctoral degree',
  ]),
  speciality: z.string().min(1).optional(),
})
