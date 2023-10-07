import type { HydratedDocument } from 'mongoose'
import {
  FamilyMemberModel,
  type FamilyMemberDocument,
} from '../models/familyMember.model'
import { UserModel } from '../models/user.model'
import { NotFoundError } from '../errors'
import { PatientModel } from '../models/patient.model'
import { type AddFamilyMemberRequest } from '../types/familyMember.types'

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

export async function createFamilyMember(
  patientUsername: string,
  req: AddFamilyMemberRequest
): Promise<HydratedDocument<FamilyMemberDocument>> {
  const user = await UserModel.findOne({ username: patientUsername })

  if (user == null) {
    throw new NotFoundError()
  }

  const patient = await PatientModel.findOne({ user: user.id })

  if (patient == null) {
    throw new NotFoundError()
  }

  const familyMember = await FamilyMemberModel.create(req)

  patient.familyMembers.push(familyMember.id)

  await patient.save()

  return familyMember
}
