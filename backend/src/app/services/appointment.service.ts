import { type HydratedDocument } from 'mongoose'
import {
  AppointmentModel,
  type AppointmentDocument,
} from '../models/appointment.model'
import { AppointmentStatus } from 'clinic-common/types/appointment.types'

import { removeTimeFromDoctorAvailability } from './doctor.service'
import { PatientModel } from '../models/patient.model'

export async function getfilteredAppointments(
  query: any
): Promise<Array<HydratedDocument<AppointmentDocument>>> {
  if (
    query.patientID !== undefined &&
    query.patientID !== null &&
    query.patientID !== ''
  ) {
    return await AppointmentModel.find({
      patientID: query.patientID,
    })
  } else if (
    query.doctorID !== undefined &&
    query.doctorID !== null &&
    query.doctorID !== ''
  ) {
    return await AppointmentModel.find({
      doctorID: query.doctorID,
    })
  } else {
    return await AppointmentModel.find()
  }
}

export async function createAndRemoveTime(
  patientID: string,
  doctorID: string,
  date: Date,
  familyID: string,
  reservedFor: string
): Promise<AppointmentDocument | null> {
  // Create a new appointment
  const newDate = new Date(date).toISOString()
  let newAppointment

  if (reservedFor == 'Me') {
    const patient = await PatientModel.findById(patientID)
    const patientName = patient?.name
    console.log(patientName)

    newAppointment = new AppointmentModel({
      patientID,
      doctorID,
      date: newDate,
      familyID,
      reservedFor: patientName,
      status: AppointmentStatus.Upcoming,
    })
  } else {
    newAppointment = new AppointmentModel({
      patientID,
      doctorID,
      date: newDate,
      familyID,
      reservedFor,
      status: AppointmentStatus.Upcoming,
    })
  }

  await removeTimeFromDoctorAvailability(doctorID, date)
  // Save the new appointment
  await newAppointment.save()

  console.log(newAppointment)

  return newAppointment
}

export async function createFollowUpAppointment(
  appointment: AppointmentDocument
): Promise<AppointmentDocument> {
  const newAppointment = new AppointmentModel({
    ...appointment,
    date: new Date(appointment.date),
    status: AppointmentStatus.Upcoming,
  })

  return await newAppointment.save()
}
