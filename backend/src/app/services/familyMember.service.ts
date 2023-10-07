import type { HydratedDocument } from 'mongoose'
import {
  FamilyMemberModel,
  type FamilyMemberDocument,
} from '../models/familyMember.model'
import { PatientModel } from '../models/patient.model'

export async function getRegisteredFamilyMembers(
  username: string | undefined
): Promise<Array<HydratedDocument<FamilyMemberDocument>>> {
  try {
    const patient = await PatientModel.findOne({ username })
    if (patient == null) {
      throw new Error('Patient not found')
    }
    return await FamilyMemberModel.find({ relatedTo: patient._id })
  } catch (err) {
    console.error(err)
    throw new Error('Server Error')
  }
}
