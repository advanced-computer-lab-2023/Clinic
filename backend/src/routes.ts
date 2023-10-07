import { Router } from 'express'

import { authRouter } from './app/controllers/auth.controller'
import { doctorsRouter } from './app/controllers/doctor.controller'
import { debugRouter } from './app/controllers/debug.controller'
import { prescriptionsRouter } from './app/controllers/prescription.controller'
import { patientRouter } from './app/controllers/patient.controller'
import {
  allowAdmins,
  allowAuthenticated,
} from './app/middlewares/auth.middleware'
import { adminRouter } from './app/controllers/admin.controller'
import { asyncWrapper } from './app/utils/asyncWrapper'

export const router = Router()

router.use('/auth', authRouter)
router.use('/doctors', allowAuthenticated, doctorsRouter)

router.use('/debug', debugRouter)

router.use('/prescriptions', prescriptionsRouter)
router.use('/patients', patientRouter)

router.use('/administrators', asyncWrapper(allowAdmins), adminRouter)
