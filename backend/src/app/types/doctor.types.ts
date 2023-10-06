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

export type UpdateDoctorRequest = z.infer<typeof UpdateDoctorRequestValidator>
export type RegisterDoctorRequest = z.infer<
  typeof RegisterDoctorRequestValidator
>

export class UpdateDoctorResponse extends DoctorResponseBase {}

export class RegisterDoctorRequestResponse {
  constructor(
    public username: string,
    public name: string,
    public email: string,
    public dateOfBirth: Date,
    public hourlyRate: number,
    public affiliation: string,
    public educationalBackground: string
  ) {}
}
