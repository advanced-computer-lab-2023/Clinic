import * as zod from 'zod'

export const AddAdminValidator = zod.object({
  username: zod
    .string()
    .min(3)
    .max(255)
    .regex(/^[a-zA-Z0-9_]+$/),
  password: zod
    .string()
    .min(8)
    .refine(
      (password) => {
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
  email: zod.string().email(),
})

export class AddAdminResponse {
  constructor(
    public username: string,
    public password: string
  ) {}
}
