export enum DoctorStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

export class GetPendingDoctorsResponse {
  constructor(
    public doctors: Array<{
      username: string
      name: string
      email: string
      dateOfBirth: Date
      hourlyRate: number
      affiliation: string
      educationalBackground: string
    }>
  ) {}
}
