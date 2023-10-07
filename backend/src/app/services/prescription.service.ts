import type { HydratedDocument } from 'mongoose'
import {
  PrescriptionModel,
  type PrescriptionDocument,
} from '../models/prescription.model'

import { type DoctorDocument } from '../models/doctor.model'
import { NotFoundError } from '../errors'
import { type PatientDocument } from '../models/patient.model'

type PrescriptionDocumentWithDoctor = Omit<
  Omit<HydratedDocument<PrescriptionDocument>, 'doctor'>,
  'patient'
> & {
  doctor: DoctorDocument
  patient: PatientDocument
}

export async function getPrescriptions(): Promise<
  PrescriptionDocumentWithDoctor[]
> {
  const prescription = await PrescriptionModel.find().populate<{
    doctor: DoctorDocument
    patient: PatientDocument
  }>('doctor', 'patient')
  if (prescription == null) {
    throw new NotFoundError()
  }
  return prescription
}
