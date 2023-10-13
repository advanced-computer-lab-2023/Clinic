import { type Types } from 'mongoose'
import { Gender } from './gender.types'
import { AppointmentDocument } from '../../backend/src/app/models/appointment.model'
import { PrescriptionDocument } from '../../backend/src/app/models/prescription.model'

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
    }
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
    public appointments: AppointmentDocument[],
    public prescriptions: PrescriptionDocument[]
  ) {}
}

export class GetAPatientResponse extends APatientResponseBase {}
