import type { z } from 'zod'
import type {
  UpdateDoctorRequestValidator,
  AddAvailableTimeSlotsRequestValidator,
} from '../validators/doctor.validator'

export enum DoctorStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

export enum ContractStatus {
  Pending = 'pending',
  Accepted = 'accepted',
  Rejected = 'rejected',
}

export interface DoctorResponseBase {
  id: string
  username: string
  name: string
  email: string
  dateOfBirth: Date
  hourlyRate: number
  affiliation: string
  educationalBackground: string
  speciality: string
  requestStatus: DoctorStatus
}

// Used for getting pending doctors and for getting approved doctors
export interface GetPendingDoctorsResponse {
  doctors: DoctorResponseBase[]
}

export interface GetApprovedDoctorResponse extends DoctorResponseBase {
  availableTimes: [Date]
  sessionRate: number
  hasDiscount: boolean
  hourlyRateWithMarkup: number
}

export interface AcceptOrRejectContractResponse extends DoctorResponseBase {
  contractStatus: ContractStatus
  availableTimes: [Date]
  employmentContract: [string]
}

export interface ApproveDoctorResponse extends DoctorResponseBase {
  availableTimes: [Date]
  employmentContract: [string]
}

export interface GetDoctorResponse extends DoctorResponseBase {
  contractStatus: ContractStatus
  availableTimes: [Date]
  employmentContract: [string]
}

export interface GetApprovedDoctorsResponse {
  doctors: GetApprovedDoctorResponse[]
}

export type UpdateDoctorRequest = z.infer<typeof UpdateDoctorRequestValidator>

export type AddAvailableTimeSlotsRequest = z.infer<
  typeof AddAvailableTimeSlotsRequestValidator
>

export interface UpdateDoctorResponse extends DoctorResponseBase {}

export interface RegisterDoctorRequestResponse extends DoctorResponseBase {}

export interface AddAvailableTimeSlotsResponse extends DoctorResponseBase {
  availableTimes: [Date]
}

export interface GetWalletMoneyResponse {
  money: number
}

export type IRegisterDoctorRequest = {
  username: string
  password: string
  name: string
  email: string
  mobileNumber: string
  dateOfBirth: Date
  hourlyRate: string
  affiliation: string
  educationalBackground: string
  speciality: string

  documents: MulterFile[]
}

type MulterFile = {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  buffer: Buffer
  size: number
}
