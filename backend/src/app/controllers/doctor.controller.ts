import { Router } from 'express'

import { getPendingDoctorRequests } from '../services/doctor.service'
import { asyncWrapper } from '../utils/asyncWrapper'
import { allowAdmins } from '../middlewares/auth.middleware'
import { GetPendingDoctorsResponse } from '../types/doctor.types'

export const doctorsRouter = Router()

doctorsRouter.get(
  '/pending',
  asyncWrapper(allowAdmins),
  asyncWrapper(async (req, res) => {
    const pendingDoctorRequests = await getPendingDoctorRequests()

    res.send(
      new GetPendingDoctorsResponse(
        pendingDoctorRequests.map((doctor) => ({
          username: doctor.user.username,
          name: doctor.name,
          email: doctor.email,
          dateOfBirth: doctor.dateOfBirth,
          hourlyRate: doctor.hourlyRate,
          affiliation: doctor.affiliation,
          educationalBackground: doctor.educationalBackground,
        }))
      )
    )
  })
)
