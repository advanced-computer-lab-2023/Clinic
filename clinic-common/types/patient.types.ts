import { type Types } from 'mongoose'
import { Gender } from './gender.types'

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
    public familyMembers: Types.ObjectId[],
    public documents: string[],
  ) {}
}

export class GetMyPatientsResponse {
  constructor(public patients: MyPatientsResponseBase[]) {}
}
