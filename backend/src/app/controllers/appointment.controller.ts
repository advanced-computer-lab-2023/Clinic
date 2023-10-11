import { Router } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import { getfilteredAppointments } from '../services/appointment.service'

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
    console.log(filterAppointments)
    res.send(filterAppointments)
  })
)
