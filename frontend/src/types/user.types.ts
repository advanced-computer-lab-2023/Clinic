export enum UserType {
  Doctor = 'Doctor',
  Patient = 'Patient',
  Admin = 'Admin',
}

export class GetUserResponse {
  constructor(
    public id: string,
    public username: string,
    public type: UserType
  ) {}
}

export class GetUserByUsernameResponse extends GetUserResponse {}

export class GetCurrentUserResponse extends GetUserResponse {}
