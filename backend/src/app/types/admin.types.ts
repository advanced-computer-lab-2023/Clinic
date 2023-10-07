import { type z } from 'zod'
import { type AddAnotherAdminValidator } from '../validators/admin.validation'

export type AddAdminRequest = z.infer<typeof AddAnotherAdminValidator>
