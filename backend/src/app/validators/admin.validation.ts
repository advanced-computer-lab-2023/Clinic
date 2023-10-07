import * as zod from 'zod'

export const AddAnotherAdminValidator = zod.object({
  username: zod.string().min(3).max(255),
  password: zod.string().min(6).max(255),
})

export class AddAnotherAdminResponse {
  constructor(
    public username: string,
    public password: string
  ) {}
}
