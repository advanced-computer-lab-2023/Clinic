import type { User } from './user'

export enum DoctorStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

export interface Doctor {
  user: User
  name: string
  email: string
  dateOfBirth: Date
  hourlyRate: number
  affiliation: string
  educationalBackground: string
  requestStatus: DoctorStatus
}
