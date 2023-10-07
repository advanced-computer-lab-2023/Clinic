import { type z } from 'zod'
import { type AddAnotherAdminValidator } from '../validators/admin.validation'

export type AddAnotherAdminRequest = z.infer<typeof AddAnotherAdminValidator>
