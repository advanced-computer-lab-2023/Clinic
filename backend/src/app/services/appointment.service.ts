import { type HydratedDocument } from 'mongoose'
import {
  AppointmentModel,
  type AppointmentDocument,
} from '../models/appointment.model'

export async function getfilteredAppointments(
  query: any
): Promise<Array<HydratedDocument<AppointmentDocument>>> {
  if (
    query.patientID !== undefined &&
    query.patientID !== null &&
    query.patientID !== '') {
    return await AppointmentModel.find({
      patientID: query.patientID
    })
  } else if (
    query.doctorID !== undefined &&
    query.doctorID !== null &&
    query.doctorID !== '') {
    return await AppointmentModel.find({
      doctorID: query.doctorID
    })
  } else {
    return await AppointmentModel.find()
  }
}
