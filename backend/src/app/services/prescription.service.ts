import type { HydratedDocument } from 'mongoose'
import {
  PrescriptionModel,
  type PrescriptionDocument,
} from '../models/prescription.model'

import { type DoctorDocument } from '../models/doctor.model'
import { NotFoundError } from '../errors'
import { PatientModel, type PatientDocument } from '../models/patient.model'
import { type UserDocument } from '../models/user.model'
import { type CreatePrescriptionRequest } from '../types/prescription.types'
import { UserModel } from '../models/user.model'

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
  const prescription = await PrescriptionModel.find({
    patient: id.split('=', 2)[1],
  })
    .populate<{
      doctor: DoctorDocument
    }>('doctor')
    .populate<{ patient: PatientDocument }>('patient')
    .exec()
  if (prescription == null) {
    throw new NotFoundError()
  }
  return prescription
}
export async function createPrescription(
  request: CreatePrescriptionRequest,
  doctorId: string
): Promise<void> {
  const User = await UserModel.findOne({
    username: request.patient,
  })
  if (User == null) {
    throw new NotFoundError()
  }
  const Patient = await PatientModel.findOne({
    user: User.id,
  }).populate<{ user: UserDocument }>('user')
  if (Patient == null) {
    throw new NotFoundError()
  }
  await PrescriptionModel.create({
    date: request.date,
    doctor: doctorId.split('=', 2)[1],
    patient: Patient.id,
  })
}
