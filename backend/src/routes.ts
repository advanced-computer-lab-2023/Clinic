import { Router } from 'express'

import { authRouter } from './app/controllers/auth.controller'
import { doctorsRouter } from './app/controllers/doctor.controller'
import { debugRouter } from './app/controllers/debug.controller'
import { prescriptionsRouter } from './app/controllers/prescription.controller'
import { familyMemberRouter } from './app/controllers/familyMember.controller'
import { patientRouter } from './app/controllers/patient.controller'
import { appointmentsRouter } from './app/controllers/appointment.controller'
import {
  allowAdmins,
} from './app/middlewares/auth.middleware'

import { adminRouter } from './app/controllers/admin.controller'
import { asyncWrapper } from './app/utils/asyncWrapper'
import { healthPackagesRouter } from './app/controllers/healthPackage.controller'

export const router = Router()

router.use('/auth', authRouter)
router.use('/doctors', doctorsRouter)

router.use('/debug', debugRouter)

router.use('/prescriptions', prescriptionsRouter)
router.use('/family-members', familyMemberRouter)
router.use('/health-packages', healthPackagesRouter)
router.use('/patients', patientRouter)
router.use('/appointment', appointmentsRouter)
router.use('/admins', asyncWrapper(allowAdmins), adminRouter)
