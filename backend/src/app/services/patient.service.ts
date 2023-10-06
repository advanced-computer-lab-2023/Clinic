import { type PatientDocument, PatientModel } from '../models/patient.model'
import { type UserDocument } from '../models/user.model'
import { NotFoundError } from '../errors'

type PatientDocumentWithUser = Omit<PatientDocument, 'user'> & {
  user: UserDocument
}

export async function getPatientByName(
  name: string
): Promise<PatientDocumentWithUser> {
  const patient = await PatientModel.findOne({ name })
    .populate<{ user: UserDocument }>('user')
    .exec()

  if (patient == null) {
    throw new NotFoundError()
  }
  return patient
}
