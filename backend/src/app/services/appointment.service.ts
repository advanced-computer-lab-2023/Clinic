import {
  AppointmentModel,
  type AppointmentDocument,
} from '../models/appointment.model'

export async function getfilteredAppointments(
  query: any
): Promise<AppointmentDocument[]> {
  if (
    query.date !== undefined &&
    query.date !== null &&
    query.date !== '' &&
    query.status !== undefined &&
    query.status !== null &&
    query.status !== ''
  ) {
    return await AppointmentModel.find({
      date: query.date,
      status: query.status,
    })
  } else if (
    query.date !== undefined &&
    query.date !== null &&
    query.date !== ''
  ) {
    return await AppointmentModel.find({ date: query.date })
  } else {
    return await AppointmentModel.find({ status: query.status })
  }
}