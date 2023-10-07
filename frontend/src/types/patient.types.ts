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
