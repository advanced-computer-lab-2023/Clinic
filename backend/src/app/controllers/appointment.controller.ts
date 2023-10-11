import { Router } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import { getfilteredAppointments } from '../services/appointment.service'
import { type AppointmentStatus, GetFilteredAppointmentsResponse } from 'clinic-common/types/appointment.types'

export const appointmentsRouter = Router()

appointmentsRouter.get(
  '/filter',
  asyncWrapper(async (req, res) => {
    const { date, status } = req.body
    const query: any = {}
    if (date !== null) {
      query.date = date
    }
    if (status !== null) {
      query.status = status
    }
    const filterAppointments = await getfilteredAppointments(query)
    res.send(
      new GetFilteredAppointmentsResponse(
        filterAppointments.map((appointment) => ({
          id: appointment.id,
          patientID: appointment.patientID.toString(),
          doctorID: appointment.doctorID.toString(),
          date: appointment.date,
          status: appointment.status as AppointmentStatus
        }))
      )
    )
  })
)
