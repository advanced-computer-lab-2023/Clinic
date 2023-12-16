export enum PharmacistStatus {
  Accepted = 'Accepted',
  Pending = 'Pending',
  Rejected = 'Rejected',
}

export enum PharmacistDegree {
  Associate = 'Associate degree',
  Bachelor = "Bachelor's degree",
  Master = "Master's degree",
  Doctoral = 'Doctoral degree',
}

type MulterFile = {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  buffer: Buffer
  size: number
}

export type AddPharmacistRequest = {
  username: string
  password: string
  name: string
  email: string
  dateOfBirth: Date
  hourlyRate: string
  affilation: string
  status: string
  educationalBackground: {
    major: string
    university: string
    graduationYear: string
    degree: string
  }
  documents: MulterFile[]
}

export interface IPharmacist {
  id: string
  user: string
  name: string
  email: string
  dateOfBirth: Date
  hourlyRate: number
  affilation: string
  status: PharmacistStatus
  educationalBackground: {
    major: string
    university: string
    graduationYear: number
    degree: PharmacistDegree
  }
  documents: string[]
  walletMoney: number
}
