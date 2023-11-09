import { type HydratedDocument } from 'mongoose'
import {
  AppointmentModel,
  type AppointmentDocument,
} from '../models/appointment.model'
import { AppointmentStatus } from 'clinic-common/types/appointment.types'

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
