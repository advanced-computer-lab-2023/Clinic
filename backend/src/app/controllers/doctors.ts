import { Router } from 'express'

import { getPendingDoctorRequests } from '../services/doctors'
import { asyncWrapper } from '../utils/asyncWrapper'
import { allowAdmins } from '../middlewares/auth'

export const doctorsRouter = Router()

doctorsRouter.get(
  '/pending',
  asyncWrapper(allowAdmins),
  asyncWrapper(async (req, res) => {
    const pendingDoctorRequests = await getPendingDoctorRequests()

    res.send(pendingDoctorRequests)
  })
)
