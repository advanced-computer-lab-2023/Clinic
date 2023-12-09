export enum UserType {
  Doctor = 'Doctor',
  Patient = 'Patient',
  Admin = 'Admin',
}

export interface GetUserResponse {
  id: string
  username: string
  type: UserType
  modelId: string
  name: string
  email: string
}

export interface GetUserByUsernameResponse extends GetUserResponse {}

export interface GetCurrentUserResponse extends GetUserResponse {}
