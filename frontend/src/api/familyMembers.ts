import { GetFamilyMembersResponse } from '@/types/familyMember.types'
import { api } from '.'

export async function getFamilyMembers(): Promise<GetFamilyMembersResponse> {
  return await api
    .get<GetFamilyMembersResponse>(`/family-members/mine`)
    .then((res) => res.data)
}
