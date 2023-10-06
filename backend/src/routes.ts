import { Router } from 'express'

import { authRouter } from './app/controllers/auth.controller'
import { doctorsRouter } from './app/controllers/doctor.controller'
import { debugRouter } from './app/controllers/debug.controller'
import { prescriptionsRouter } from './app/controllers/prescription.controller'
import { patientRouter } from './app/controllers/patient.controller'
import { allowAuthenticated } from './app/middlewares/auth.middleware'

export const router = Router()

router.use('/auth', authRouter)
router.use('/doctors', allowAuthenticated, doctorsRouter)

router.use('/debug', debugRouter)

router.use('/prescriptions', prescriptionsRouter)
router.use('/patients', patientRouter)
