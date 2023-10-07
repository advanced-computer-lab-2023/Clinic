import { type z } from 'zod'

import type {
  AddAdminValidator,
  RemoveUserValidator,
} from '../validators/admin.validation'

export type AddAdminRequest = z.infer<typeof AddAdminValidator>
export type RemoveUserRequest = z.infer<typeof RemoveUserValidator>
