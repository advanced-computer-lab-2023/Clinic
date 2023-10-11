export interface Appointment {
  patientID: string
  doctorID: string
  date: Date
  status: AppointmentStatus
}

export enum AppointmentStatus {
  Upcoming = 'upcoming',
  Completed = 'completed',
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
  constructor(public appointments: AppointmentResponseBase[]) {}
}
