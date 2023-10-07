import { type z } from 'zod'
import { type AddFamilyMemberRequestValidator } from '../validators/familyMembers.validator'

export class FamilyMemberResponseBase {
  constructor(
    public id: string,
    public name: string,
    public nationalId: string,
    public age: number,
    public gender: string,
    public relation: string /**
     * Removed this because when we request a family member, we already request the
     * family member by its patient username, so we already know who the patient is.
     * Leaving this complicates the service code so no need to add it.
     */ // public relatedTo: string
  ) {}
}

export class GetFamilyMembersResponse {
  constructor(public familyMembers: FamilyMemberResponseBase[]) {}
}

export class AddFamilyMemberResponse extends FamilyMemberResponseBase {}

export type AddFamilyMemberRequest = z.infer<
  typeof AddFamilyMemberRequestValidator
>
