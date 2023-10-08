export interface Appointment {
  patientID: string
  doctorID: string
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
    public patientID: string,
    public doctorID: string,
    public date: Date,
    public status: AppointmentStatus
  ) {}
}

export class GetFilteredAppointmentsResponse {
  constructor(public doctors: AppointmentResponseBase[]) {}
}
