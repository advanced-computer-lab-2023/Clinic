import { Router } from 'express'

import { getPendingDoctorRequests } from '../services/doctor.service'
import { asyncWrapper } from '../utils/asyncWrapper'
import { allowAdmins } from '../middlewares/auth.middleware'

export const doctorsRouter = Router()

doctorsRouter.get(
  '/pending',
  asyncWrapper(allowAdmins),
  asyncWrapper(async (req, res) => {
    const pendingDoctorRequests = await getPendingDoctorRequests()

    res.send(pendingDoctorRequests)
  })
)
