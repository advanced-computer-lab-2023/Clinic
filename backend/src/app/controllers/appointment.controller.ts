import { Router } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import {
  createAndRemoveTime,
  getfilteredAppointments,
  createFollowUpAppointment,
} from '../services/appointment.service'
import {
  AppointmentStatus,
  GetFilteredAppointmentsResponse,
} from 'clinic-common/types/appointment.types'
import { PatientModel } from '../models/patient.model'
import { DoctorModel } from '../models/doctor.model'
import { type HydratedDocument } from 'mongoose'
import { type UserDocument, UserModel } from '../models/user.model'

export const appointmentsRouter = Router()

appointmentsRouter.get(
  '/filter',
  asyncWrapper(async (req, res) => {
    const query: any = {}

    const user: HydratedDocument<UserDocument> | null = await UserModel.findOne(
      { username: req.username }
    )

    if (user != null && user.type === 'Patient') {
      const patient = await PatientModel.findOne({ user: user.id })
      query.patientID = patient?.id
    } else if (user != null && user.type === 'Doctor') {
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
          status:
            new Date(appointment.date) > new Date()
              ? AppointmentStatus.Upcoming
              : AppointmentStatus.Completed,
        }))
      )
    )
  })
)

appointmentsRouter.post(
  '/makeappointment',
  asyncWrapper(async (req, res) => {
    const { date } = req.body // Assuming the date is sent in the request body intype DaTe

    const user = await UserModel.findOne({ username: req.username })

    if (user != null) {
      if (user.type === 'Patient') {
        const patient = await PatientModel.findOne({ user: user.id })

        if (patient) {
          // Assuming 'doctorID' is known or can be retrieved from the request
          const doctorID = req.body.doctorid

          const appointment = await createAndRemoveTime(
            patient.id,
            doctorID,
            date
          )

          if (appointment) {
            res.status(201).json(appointment)
          } else {
            res.status(500).send('Appointment creation failed')
          }
        } else {
          res.status(404).send('Patient not found')
        }
      } else {
        res.status(403).send('Only patients can make appointments')
      }
    } else {
      res.status(401).send('User not found')
    }
  })
)

appointmentsRouter.post(
  '/createFollowUp',
  asyncWrapper(async (req, res) => {
    const appointment = req.body
    const newAppointment = await createFollowUpAppointment(appointment)
    res.send(newAppointment)
  })
)
