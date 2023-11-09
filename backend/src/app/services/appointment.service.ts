import { type HydratedDocument } from 'mongoose'
import {
  AppointmentModel,
  type AppointmentDocument,
} from '../models/appointment.model'
import { AppointmentStatus } from 'clinic-common/types/appointment.types'
import { removeTimeFromDoctorAvailability } from './doctor.service'

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
  date: string
): Promise<AppointmentDocument | null> {
  // Create a new appointment
  const newAppointment = new AppointmentModel({
    patientID,
    doctorID,
    date,
    status: AppointmentStatus.Upcoming,
  })

  // Save the new appointment
  await newAppointment.save()

  // Now, you need to remove the 'date' from the doctor's available times.
  // You should have a function in your doctor service to handle this.

  await removeTimeFromDoctorAvailability(doctorID, date)

  return newAppointment
}
