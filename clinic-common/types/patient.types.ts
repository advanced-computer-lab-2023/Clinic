import { type Types } from 'mongoose'

export class PatientResponseBase {
  constructor(
    public id: string,
    public username: string,
    public name: string,
    public email: string,
    public mobileNumber: string,
    public dateOfBirth: Date,
    public gender: string,
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
    public gender: string,
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
