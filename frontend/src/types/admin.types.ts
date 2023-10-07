import { type z } from 'zod'

import type { AddAdminValidator } from '../validators/admin.validation'

export type AddAdminRequest = z.infer<typeof AddAdminValidator>
