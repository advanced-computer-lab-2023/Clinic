import { Router } from 'express'

import { authRouter } from './app/controllers/auth'
import { doctorsRouter } from './app/controllers/doctors'
import { debugRouter } from './app/controllers/debug'

export const router = Router()

router.use('/auth', authRouter)
router.use('/doctors', doctorsRouter)

router.use('/debug', debugRouter)
