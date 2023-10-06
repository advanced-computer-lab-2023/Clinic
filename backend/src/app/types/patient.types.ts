export class PatientResponseBase {
  constructor(
    public username: string,
    public password: string,
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

export class GetPatientResponse extends PatientResponseBase {}
