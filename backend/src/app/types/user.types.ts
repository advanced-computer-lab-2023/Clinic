export enum UserType {
  Doctor = 'Doctor',
  Patient = 'Patient',
  Admin = 'Admin',
}

export class GetUserByUsernameResponse {
  constructor(
    public id: string,
    public username: string,
    public type: UserType
  ) {}
}
