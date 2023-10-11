export interface Appointment {
  patientID: string
  doctorID: string
  date: string
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
    public date: string,
    public status: AppointmentStatus
  ) {}
}

export class GetFilteredAppointmentsResponse {
  constructor(public appointments: AppointmentResponseBase[]) {}
}
