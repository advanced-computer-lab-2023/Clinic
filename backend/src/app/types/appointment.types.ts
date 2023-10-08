import { type Schema } from 'mongoose'

export interface Appointment {
  patientID: Schema.Types.ObjectId
  doctorID: Schema.Types.ObjectId
  date: Date
  status: AppointmentStatus
}

export enum AppointmentStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Canceled = 'canceled',
}

export class AppointmentResponseBase {
  constructor(
    public id: string,
    public patientID: Schema.Types.ObjectId,
    public doctorID: Schema.Types.ObjectId,
    public date: Date,
    public status: AppointmentStatus
  ) {}
}

export class GetFilteredAppointmentsResponse {
  constructor(public doctors: AppointmentResponseBase[]) {}
}
