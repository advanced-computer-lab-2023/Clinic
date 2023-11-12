import { type z } from 'zod'
import {
  LinkFamilyMemberRequestValidator,
  type AddFamilyMemberRequestValidator,
} from '../validators/familyMembers.validator'
import { Gender } from './gender.types'
import { PatientResponseBase } from './patient.types'

export enum Relation {
  Wife = 'wife',
  Husband = 'husband',
  Son = 'son',
  Daughter = 'daughter',
}

export interface FamilyMemberResponseBase {
  id: string
  name: string
  nationalId: string
  age: number
  gender: Gender
  relation: Relation
  healthPackage: {
    name?: string
    renewalDate?: string
    id?: string
  }
  healthPackageHistory: Array<{ package: string; date: Date }> //has the name not id
}

export type GetFamilyMembersResponse = FamilyMemberResponseBase[]

export type AddFamilyMemberResponse = void

export type AddFamilyMemberRequest = z.infer<
  typeof AddFamilyMemberRequestValidator
>

export interface LinkFamilyMemberResponse extends FamilyMemberResponseBase {}

export type LinkFamilyMemberRequest = z.infer<
  typeof LinkFamilyMemberRequestValidator
>

export interface GetFamilyMemberResponse {
  familyMember: FamilyMemberResponseBase
  patient: PatientResponseBase
}

export type GetLinkedFamilyMembersResponse = Array<{
  id: string
  patientId: string
  username: string
  mobileNumber: string
  email: string
  dateOfBirth: string
  name: string
  gender: string
  relation: Relation
  healthPackage: {
    name: string
    id: string
  }
}>
