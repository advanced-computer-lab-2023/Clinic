import type { z } from 'zod'
import type { UserValidator } from '../validators/user.validator'

export type User = z.infer<typeof UserValidator>
