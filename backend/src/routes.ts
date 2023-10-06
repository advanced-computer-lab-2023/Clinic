import { Router } from 'express'

import { authRouter } from './app/controllers/auth.controller'
import { doctorsRouter } from './app/controllers/doctor.controller'
import { debugRouter } from './app/controllers/debug.controller'
import { prescriptionsRouter } from './app/controllers/prescription.controller'

export const router = Router()

router.use('/auth', authRouter)
router.use('/doctors', doctorsRouter)

router.use('/debug', debugRouter)

router.use('/prescriptions', prescriptionsRouter)
