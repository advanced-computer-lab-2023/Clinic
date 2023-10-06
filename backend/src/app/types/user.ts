import type { z } from 'zod'
import type { UserValidator } from '../validators/userValidator'

export type User = z.infer<typeof UserValidator>
