import * as zod from 'zod'

export const AddAdminValidator = zod.object({
  username: zod
    .string()
    .min(3)
    .max(255)
    .regex(/^[a-zA-Z0-9_]+$/),
  password: zod.string().min(6).max(255),
})

export class AddAdminResponse {
  constructor(
    public username: string,
    public password: string
  ) {}
}
