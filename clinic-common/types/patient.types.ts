import { type Gender } from './gender.types'
import { type GetFilteredAppointmentsResponse } from './appointment.types'

export class PatientResponseBase {
  constructor(
    public id: string,
    public username: string,
    public name: string,
    public email: string,
    public mobileNumber: string,
    public dateOfBirth: Date,
    public gender: Gender,
    public emergencyContact: {
      name: string
      mobileNumber: string
    },
    public notes: string[]
  ) {}
}

type MulterFile = {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  buffer: Buffer
  size: number
}

export interface uploadMedicalHistoryRequest {
  id: string
  medicalHistory: MulterFile
}

export class GetPatientResponse {
  constructor(public patients: PatientResponseBase[]) {}
}

export class MyPatientsResponseBase {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public mobileNumber: string,
    public dateOfBirth: string,
    public gender: Gender,
    public emergencyContact: {
      name: string
      mobileNumber: string
    },
    public familyMembers: string[]
  ) {}
}

export class GetMyPatientsResponse {
  constructor(public patients: MyPatientsResponseBase[]) {}
}

export class APatientResponseBase {
  constructor(
    public id: string,
    public username: string,
    public name: string,
    public email: string,
    public mobileNumber: string,
    public dateOfBirth: Date,
    public gender: Gender,
    public emergencyContact: {
      name: string
      mobileNumber: string
    },
    public documents: string[],
    public appointments: GetFilteredAppointmentsResponse,
    public prescriptions: any[],
    public notes: string[],
    public walletMoney: number
  ) {}
}

export class GetAPatientResponse extends APatientResponseBase {}

export class GetWalletMoneyResponse {
  constructor(public money: number) {}
}
