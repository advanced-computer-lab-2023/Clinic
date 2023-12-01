export interface Appointment {
  patientID: string
  doctorID: string
  date: string
  status: AppointmentStatus
}

export enum AppointmentStatus {
  Upcoming = 'upcoming',
  Completed = 'completed',
  Cancelled = 'cancelled',
  Rescheduled = 'rescheduled',
}

export class AppointmentResponseBase {
  constructor(
    public id: string,
    public patientID: string,
    public doctorID: string,
    public doctorName: string,
    public doctorTimes: string[],
    public date: string,
    public familyID: string,
    public reservedFor: string
  ) {
    const appointmentDate = new Date(date).getTime()
    const currentDate = Date.now()
    this.status =
      appointmentDate > currentDate
        ? AppointmentStatus.Upcoming
        : AppointmentStatus.Completed
  }

  public status: AppointmentStatus
}

export class GetFilteredAppointmentsResponse {
  constructor(public appointments: AppointmentResponseBase[]) {}
}

export enum followupRequestStatus {
  pending = 'pending',
  accepted = 'accepted',
  rejected = 'rejected',
}

export class FollowupRequestResponseBase {
  constructor(
    public id: string,
    public patientID: string,
    public patientName: string,
    public appointmentDate: string,
    public followupDate: string,
    public familyID: string,
    public reservedFor: string
  ) {}
}

export class GetFollowupRequestsResponse {
  constructor(public requests: FollowupRequestResponseBase[]) {}
}
