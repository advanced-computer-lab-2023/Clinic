import type { HydratedDocument } from 'mongoose'
import {
  PrescriptionModel,
  type PrescriptionDocument,
} from '../models/prescription.model'

import { DoctorModel, type DoctorDocument } from '../models/doctor.model'
import { NotFoundError } from '../errors'
import { PatientModel, type PatientDocument } from '../models/patient.model'
import { type UserDocument } from '../models/user.model'
import { type CreatePrescriptionRequest } from 'clinic-common/types/prescription.types'
import { UserModel } from '../models/user.model'

type PrescriptionDocumentWithDoctor = Omit<
  Omit<HydratedDocument<HydratedDocument<PrescriptionDocument>>, 'doctor'>,
  'patient'
> & {
  doctor: DoctorDocument
  patient: PatientDocument
}

export async function getPrescriptions(
  userName: string
): Promise<PrescriptionDocumentWithDoctor[]> {
  const User = await UserModel.findOne({
    username: userName,
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

  const prescription = await PrescriptionModel.find({
    patient: Patient.id,
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

export async function editPrescription(
  request: CreatePrescriptionRequest,
  id: string
): Promise<void> {
  const prescription = await PrescriptionModel.findOne({
    _id: id,
  })

  if (prescription == null) {
    throw new NotFoundError()
  }

  await PrescriptionModel.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        date: request.date,
        medicine: request.medicine,
      },
    }
  )
}

export async function createPrescription(
  request: CreatePrescriptionRequest,
  doctorUsername: string
): Promise<void> {
  const DoctorUser = await UserModel.findOne({
    username: doctorUsername,
  })

  if (DoctorUser == null) {
    throw new NotFoundError()
  }

  const Doctor = await DoctorModel.findOne({
    user: DoctorUser.id,
  }).populate<{ user: UserDocument }>('user')

  if (Doctor == null) {
    throw new NotFoundError()
  }

  const PatientUser = await UserModel.findOne({
    username: request.patient,
  })

  if (PatientUser == null) {
    throw new NotFoundError()
  }

  const Patient = await PatientModel.findOne({
    user: PatientUser.id,
  }).populate<{ user: UserDocument }>('user')

  if (Patient == null) {
    throw new NotFoundError()
  }

  await PrescriptionModel.create({
    date: request.date,
    doctor: Doctor.id,
    patient: Patient.id,
    medicine: request.medicine,
  })
}

export async function getSinglePrescription(
  id: string,
  userName: string
): Promise<PrescriptionDocumentWithDoctor> {
  const User = await UserModel.findOne({
    username: userName,
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

  const prescription = await PrescriptionModel.findOne({
    _id: id,
    patient: Patient.id,
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

export async function getSinglePrescriptionForDoctor(id: string): Promise<any> {
  const prescription = await PrescriptionModel.findOne({
    _id: id,
  })
  console.log('PRESCRIPTION', prescription)

  if (prescription == null) {
    throw new NotFoundError()
  }

  return prescription.medicine
}
