import type { HydratedDocument } from 'mongoose'
import {
  PrescriptionModel,
  type PrescriptionDocument,
} from '../models/prescription.model'

import { type DoctorDocument } from '../models/doctor.model'
import { NotFoundError } from '../errors'

type PrescriptionDocumentWithDoctor = Omit<
  HydratedDocument<PrescriptionDocument>,
  'doctor'
> & {
  doctor: DoctorDocument
}

export async function getPrescriptions(
  id: string
): Promise<PrescriptionDocumentWithDoctor[]> {
  const prescription = await PrescriptionModel.find({ patient: id }).populate<{
    doctor: DoctorDocument
  }>('doctor')
  if (prescription == null) {
    throw new NotFoundError()
  }
  return prescription
}
