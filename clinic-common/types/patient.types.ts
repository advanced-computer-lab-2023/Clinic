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

export interface MyPatientsResponseBase {
  id: string
  name: string
  username: string
  email: string
  mobileNumber: string
  dateOfBirth: string
  gender: Gender
  emergencyContact: {
    name: string
    mobileNumber: string
  }
  familyMembers: string[]
}

export interface GetMyPatientsResponse {
  patients: MyPatientsResponseBase[]
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

export class GetPatientLinkingMeResponse {
  constructor(public names: string[]) {}
}
