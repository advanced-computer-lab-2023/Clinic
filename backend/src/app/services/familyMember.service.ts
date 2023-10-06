import type { HydratedDocument } from 'mongoose'
import { FamilyMemberModel } from '../models/familyMember.model'
import type { FamilyMember } from '../types/familyMember.types'

export async function getRegisteredFamilyMembers(
  username: string | undefined
): Promise<Array<HydratedDocument<FamilyMember>>> {
  return await FamilyMemberModel.find({ relatedTo: username })
}
