import { type Types } from 'mongoose'
import { Gender } from './gender.types'
import { PrescriptionDocument } from '../../backend/src/app/models/prescription.model'
import { GetFilteredAppointmentsResponse } from './appointment.types'

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
    public familyMembers: Types.ObjectId[]
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
    public prescriptions: PrescriptionDocument[],
    public notes: string[]
  ) {}
}

export class GetAPatientResponse extends APatientResponseBase {}
