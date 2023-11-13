import { type z } from 'zod'

import type { AddAdminValidator } from '../validators/admin.validation'

export type AddAdminRequest = z.infer<typeof AddAdminValidator>

export class UsersResponse {
  constructor(
    public username: string,
    public type: string
  ) {}
}

export class AdminResponse {
  constructor(
    public username: string,
    public email: string,
    public type: string
  ) {}
}

export class GetUsersResponse {
  constructor(public user: UsersResponse[]) {}
}
