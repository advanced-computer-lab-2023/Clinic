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

export async function getPrescriptions(
  id: string
): Promise<PrescriptionDocumentWithDoctor[]> {
  const prescription = await PrescriptionModel.find({ patient: id }).populate<{
    doctor: DoctorDocument
    patient: PatientDocument
  }>('doctor', 'patient')
  if (prescription == null) {
    throw new NotFoundError()
  }
  return prescription
}
// export async function createPrescription(
//   request: CreatePrescriptionRequest,
//   doctorId:string
// ): Promise<PrescriptionDocumentWithDoctor[]> {
//   const patient=await PatientModel.find({email:request.patient})
//   const prescription=await PrescriptionModel.create({
//     date:request.date,doctor:doctorId,patient:patient.id
//   })
// }
