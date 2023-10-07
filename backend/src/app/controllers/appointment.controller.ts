import { Router } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import { getfilteredAppointments } from '../services/appointment.service'
// import { GetFilteredAppointmentsResponse } from '../types/appointment.types'

export const appointmentsRouter = Router()

appointmentsRouter.get(
  '/filter',
  asyncWrapper(async (req, res) => {
    try {
      const { date, status } = req.body
      const query: any = {}
      if (date !== null) {
        query.date = date
      }
      if (status !== null) {
        query.status = status
      }
      const filterAppointments = await getfilteredAppointments(query)
      res.send(filterAppointments)
      // res.send(
      //     new GetFilteredAppointmentsResponse(
      //         filterAppointments.map((appointment) => ({
      //         id: appointment.id.toString(),
      //         patientID: appointment.patientID,
      //         doctorID: appointment.doctorID,
      //         date: appointment.date,
      //         status: appointment.status.toString(),
      //       }))
      //     )
      //   )
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Server Error' })
    }
  })
)
