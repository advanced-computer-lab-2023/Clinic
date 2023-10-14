import { Router } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import { getfilteredAppointments } from '../services/appointment.service'
import { AppointmentStatus, GetFilteredAppointmentsResponse } from 'clinic-common/types/appointment.types'
import { PatientModel } from '../models/patient.model'
import { DoctorModel } from '../models/doctor.model'
import { type HydratedDocument } from 'mongoose'
import { type UserDocument, UserModel } from '../models/user.model'

export const appointmentsRouter = Router()

appointmentsRouter.get(
  '/filter',
  asyncWrapper(async (req, res) => {
    const query: any = {}

    const user: HydratedDocument<UserDocument> | null = await UserModel.findOne({ username: req.username })
    if ((user != null) && user.type === 'Patient') {
      const patient = await PatientModel.findOne({ user: user.id })
      query.patientID = patient?.id
    }
    else if ((user != null) && user.type === 'Doctor') {
      const doctor = await DoctorModel.findOne({ user: user.id })
      query.doctorID = doctor?.id
    }

    const filterAppointments = await getfilteredAppointments(query)
    res.send(
      new GetFilteredAppointmentsResponse(
        filterAppointments.map((appointment) => ({
          id: appointment.id,
          patientID: appointment.patientID.toString(),
          doctorID: appointment.doctorID.toString(),
          date: appointment.date,
          status: new Date(appointment.date) > new Date() ? AppointmentStatus.Upcoming : AppointmentStatus.Completed, 
        }))
      )
    )
  })
)
