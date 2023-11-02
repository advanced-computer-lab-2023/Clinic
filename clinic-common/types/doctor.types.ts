import type { z } from 'zod'
import type {
  UpdateDoctorRequestValidator,
  RegisterDoctorRequestValidator,
} from '../validators/doctor.validator'

export enum DoctorStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

export class DoctorResponseBase {
  constructor(
    public id: string,
    public username: string,
    public name: string,
    public email: string,
    // public dateOfBirth: Date,
    /**
     * Changed this to also accept strings not just Dates, because JSON doesn't support Dates,
     * and this object is sent to the frontend as JSON, so in the frontend it is actually
     * received as a string not a Date, even if you send a Date.
     *
     **/
    public dateOfBirth: Date,
    public hourlyRate: number,
    public affiliation: string,
    public educationalBackground: string,
    public speciality: string,
    public requestStatus: DoctorStatus
  ) {}
}

// Used for getting pending doctors and for getting approved doctors
export class GetPendingDoctorsResponse {
  constructor(public doctors: DoctorResponseBase[]) {}
}

export class GetApprovedDoctorResponse extends DoctorResponseBase {
  constructor(
    id: string,
    username: string,
    name: string,
    email: string,
    dateOfBirth: Date,
    hourlyRate: number,
    affiliation: string,
    educationalBackground: string,
    speciality: string,
    requestStatus: DoctorStatus,
    public availableTimes: [string],
    public sessionRate: number // Additional property
  ) {
    super(
      id,
      username,
      name,
      email,
      dateOfBirth,
      hourlyRate,
      affiliation,
      educationalBackground,
      speciality,
      requestStatus
    )
  }
}

export class GetApprovedDoctorsResponse {
  constructor(public doctors: GetApprovedDoctorResponse[]) {}
}

export type UpdateDoctorRequest = z.infer<typeof UpdateDoctorRequestValidator>

export type RegisterDoctorRequest = z.infer<
  typeof RegisterDoctorRequestValidator
>

export class UpdateDoctorResponse extends DoctorResponseBase {}

export class RegisterDoctorRequestResponse extends DoctorResponseBase {}

export class GetDoctorResponse extends DoctorResponseBase {}
