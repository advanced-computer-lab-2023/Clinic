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
import { getApprovedDoctorById } from '../services/doctor.service'

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
    const appointmentResponses = await Promise.all(
      filterAppointments.map(async (appointment) => {
        const doctor = await getApprovedDoctorById(
          appointment.doctorID.toString()
        )

        return {
          id: appointment.id,
          patientID: appointment.patientID.toString(),
          doctorID: appointment.doctorID.toString(),
          doctorName: doctor.name,
          date: appointment.date,
          familyID: appointment.familyID || '',
          reservedFor: appointment.reservedFor || 'Me',
          status:
            new Date(appointment.date) > new Date()
              ? AppointmentStatus.Upcoming
              : AppointmentStatus.Completed,
        }
      })
    )
    res.send(new GetFilteredAppointmentsResponse(appointmentResponses))
  })
)

appointmentsRouter.post(
  '/makeappointment',
  asyncWrapper(async (req, res) => {
    const { date, familyID, reservedFor, toPayUsingWallet } = req.body // Assuming the date is sent in the request body intype DaTe

    const user = await UserModel.findOne({ username: req.username })

    if (user != null) {
      if (user.type === 'Patient') {
        const patient = await PatientModel.findOne({ user: user.id })

        if (patient) {
          // Assuming 'doctorID' is known or can be retrieved from the request

          const doctorID = req.body.doctorid
          const doctor = await DoctorModel.findOne({ _id: doctorID })

          if (patient.walletMoney - toPayUsingWallet < 0) {
            res.status(403).send('Not enough money in wallet')
          } else if (!doctor) {
            res.status(404).send('Issues fetching doctor')
          } else {
            patient.walletMoney -= toPayUsingWallet
            await patient.save()

            doctor.walletMoney! += doctor.hourlyRate
            await doctor.save()

            const appointment = await createAndRemoveTime(
              patient.id,
              doctorID,
              date,
              familyID,
              reservedFor
            )

            if (appointment) {
              res.status(201).json(appointment)
            } else {
              patient.walletMoney += toPayUsingWallet //reverting the wallet money
              await patient.save()

              doctor.walletMoney! -= doctor.hourlyRate
              await doctor.save()

              res.status(500).send('Appointment creation failed')
            }
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
