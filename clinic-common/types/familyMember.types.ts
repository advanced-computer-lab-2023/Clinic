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

export class FamilyMemberResponseBase {
  constructor(
    public id: string,
    public name: string,
    public nationalId: string,
    public age: number,
    public gender: Gender,
    public relation: Relation
  ) {}
}

export class GetFamilyMembersResponse {
  constructor(public familyMembers: FamilyMemberResponseBase[]) {}
}

export class AddFamilyMemberResponse extends FamilyMemberResponseBase {}

export type AddFamilyMemberRequest = z.infer<
  typeof AddFamilyMemberRequestValidator
>

export class LinkFamilyMemberResponse extends FamilyMemberResponseBase {}

export type LinkFamilyMemberRequest = z.infer<
  typeof LinkFamilyMemberRequestValidator
>

export class GetFamilyMemberResponse {
  constructor(
    public familyMember: FamilyMemberResponseBase,
    public patient: PatientResponseBase
  ) {}
}
