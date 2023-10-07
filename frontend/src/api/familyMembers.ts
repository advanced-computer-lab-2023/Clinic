import { GetFamilyMembersResponse } from '@/types/familyMember.types'
import { api } from '.'
import { AddFamilyMemberRequest } from '@/types/familyMember.types'
import { AddFamilyMemberResponse } from '@/types/familyMember.types'

export async function getFamilyMembers(): Promise<GetFamilyMembersResponse> {
  return await api
    .get<GetFamilyMembersResponse>(`/family-members/mine`)
    .then((res) => res.data)
}

export async function addFamilyMember(
  username: string,
  req: AddFamilyMemberRequest
): Promise<AddFamilyMemberResponse> {
  return await api
    .post<AddFamilyMemberResponse>(`/family-members/${username}`, req)
    .then((res) => res.data)
}
