import { NotFoundError } from '../errors'
import { type PatientDocument, PatientModel } from '../models/patient.model'
import { type UserDocument } from '../models/user.model'
import { type WithUser } from '../utils/typeUtils'

type PatientDocumentWithUser = WithUser<PatientDocument>

export async function getPatientByName(
  name: string
): Promise<PatientDocumentWithUser[]> {
  if (name === undefined || name.trim() === '') {
    // Handle the case when name is empty or contains only whitespace
    return await PatientModel.find({})
  }
  const nameRegex = new RegExp(`^${name}`, 'i') // 'i' for case-insensitive matching

  const patients = await PatientModel.find({ name: { $regex: nameRegex } })
    .populate<{ user: UserDocument }>('user')
    .exec()

  return patients
}

export async function getPatientByID(
  id: string
): Promise<PatientDocumentWithUser> {
  const patient = await PatientModel.findOne({ _id: id })
    .populate<{ user: UserDocument }>('user')
    .exec()
  if (patient == null) throw new NotFoundError()
  return patient
}
