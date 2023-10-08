import type { HydratedDocument } from 'mongoose'
import { type FamilyMemberDocument } from '../models/familyMember.model'
import { UserModel } from '../models/user.model'
import { NotFoundError } from '../errors'
import { PatientModel } from '../models/patient.model'

export async function getFamilyMembers(
  username: string
): Promise<Array<HydratedDocument<FamilyMemberDocument>>> {
  const user = await UserModel.findOne({ username })

  if (user == null) {
    throw new NotFoundError()
  }

  const patient = await PatientModel.findOne({ user: user.id }).populate<{
    familyMembers: Array<HydratedDocument<FamilyMemberDocument>>
  }>({
    path: 'familyMembers',
  })

  if (patient == null) {
    throw new NotFoundError()
  }

  return patient.familyMembers
}
