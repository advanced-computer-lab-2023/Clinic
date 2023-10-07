export interface FamilyMember {
  name: string
  nationalId: string
  age: number
  gender: string
  relation: string
  relatedTo: string
}

export class FamilyMemberResponseBase {
  constructor(
    public id: string,
    public name: string,
    public nationalId: string,
    public age: number,
    public gender: string,
    public relation: string,
    public relatedTo: string
  ) {}
}

// Used for getting pending doctors and for getting approved doctors
export class GetFamilyMembersResponse {
  constructor(public doctors: FamilyMemberResponseBase[]) {}
}
