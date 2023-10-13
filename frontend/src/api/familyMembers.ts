import {
  GetFamilyMemberResponse,
  GetFamilyMembersResponse,
} from 'clinic-common/types/familyMember.types'
import { api } from '.'
import { AddFamilyMemberRequest } from 'clinic-common/types/familyMember.types'
import { AddFamilyMemberResponse } from 'clinic-common/types/familyMember.types'

export async function getFamilyMembers(): Promise<GetFamilyMembersResponse> {
  return await api
    .get<GetFamilyMembersResponse>(`/family-members/mine`)
    .then((res) => res.data)
}

export async function getFamilyMemberById(
  id: string
): Promise<GetFamilyMemberResponse> {
  return await api
    .get<GetFamilyMemberResponse>(`/family-members/${id}`)
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
