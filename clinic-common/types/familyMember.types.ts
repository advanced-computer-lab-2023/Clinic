import { type z } from 'zod'
import { type AddFamilyMemberRequestValidator } from '../validators/familyMembers.validator'

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
    public gender: string,
    public relation: Relation, 
  ) {}
}

export class GetFamilyMembersResponse {
  constructor(public familyMembers: FamilyMemberResponseBase[]) {}
}

export class AddFamilyMemberResponse extends FamilyMemberResponseBase {}

export type AddFamilyMemberRequest = z.infer<
  typeof AddFamilyMemberRequestValidator
>
