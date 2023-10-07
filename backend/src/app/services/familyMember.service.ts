import type { HydratedDocument } from 'mongoose'
import {
  FamilyMemberModel,
  type FamilyMemberDocument,
} from '../models/familyMember.model'

export async function getRegisteredFamilyMembers(
  username: string | undefined
): Promise<Array<HydratedDocument<FamilyMemberDocument>>> {
  return await FamilyMemberModel.find({ relatedTo: username })
}
