import type { z } from 'zod'
import type { UpdateDoctorRequestValidator } from '../validators/doctor.validator'

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
    public dateOfBirth: Date,
    public hourlyRate: number,
    public affiliation: string,
    public educationalBackground: string
  ) {}
}

// Used for getting pending doctors and for getting approved doctors
export class GetPendingDoctorsResponse {
  constructor(public doctors: DoctorResponseBase[]) {}
}

export class GetApprovedDoctorsResponse {
  constructor(public doctors: DoctorResponseBase[]) {}
}
class GetDoctorWithRateResponseBase {
  constructor(
    public id: string,
    public username: string,
    public name: string,
    public email: string,
    public dateOfBirth: Date,
    public hourlyRate: number,
    public affiliation: string,
    public educationalBackground: string,
    public sessionRate: number,
    public speciality: string
  ) {}
}

export class GetDoctorWithRateResponse {
  constructor(public doctors: GetDoctorWithRateResponseBase[]) {}
}

export type UpdateDoctorRequest = z.infer<typeof UpdateDoctorRequestValidator>

export class UpdateDoctorResponse extends DoctorResponseBase {}
