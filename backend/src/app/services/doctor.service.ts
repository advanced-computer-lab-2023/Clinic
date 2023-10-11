import { DoctorModel, type DoctorDocument } from '../models/doctor.model'
import { UserModel, type UserDocument } from '../models/user.model'
import {
  DoctorStatus,
  type UpdateDoctorRequest,
} from 'clinic-common/types/doctor.types'
import { APIError, NotFoundError } from '../errors'
import { type WithUser } from '../utils/typeUtils'
import { type PatientDocument, PatientModel } from '../models/patient.model'
import { AppointmentModel } from '../models/appointment.model'
import { type ObjectId } from 'mongoose'
/**
 * TODO: Replace DoctorDocumentWithUser with WithUser<DoctorDocument>,
 * leaving it for now not to break other PRs
 */
export type DoctorDocumentWithUser = WithUser<DoctorDocument>

export async function getPendingDoctorRequests(): Promise<DoctorDocumentWithUser[]> {
  const models = await DoctorModel.find({
    requestStatus: DoctorStatus.Pending,
  }).populate<{ user: UserDocument }>('user')
  return models
}

export async function updateDoctorByUsername(
  username: string,
  request: UpdateDoctorRequest
): Promise<DoctorDocumentWithUser> {
  const user = await UserModel.findOne({ username })

  if (user == null) throw new NotFoundError()

  if ((await DoctorModel.count({ email: request.email })) > 0) {
    throw new APIError('Email already exists', 400)
  }

  const updatedDoctor = await DoctorModel.findOneAndUpdate(
    { user: user.id },
    request,
    {
      new: true,
    }
  ).populate<{
    user: UserDocument
  }>('user')

  if (updatedDoctor == null) {
    throw new NotFoundError()
  }

  return updatedDoctor
}

// fetches approved doctors only
export async function getAllDoctors(): Promise<DoctorDocumentWithUser[]> {
  const models = await DoctorModel.find({
    requestStatus: 'approved',
  }).populate<{ user: UserDocument }>('user')

  return models
}

export async function getDoctorByUsername(
  username: string
): Promise<DoctorDocumentWithUser> {
  const user = await UserModel.findOne({ username })

  if (user == null) throw new NotFoundError()

  const doctor = await DoctorModel.findOne({ user: user.id }).populate<{
    user: UserDocument
  }>('user')

  if (doctor == null) throw new NotFoundError()

  return doctor
}

// Define the function to get all patients of a doctor
export async function getMyPatients(
  doctorId: ObjectId
): Promise<PatientDocument[]> {
  // Find all appointments with the given doctorId
  const appointments = await AppointmentModel.find({ doctorID: doctorId })
  // Get all patients who had appointments with the doctor
  const patients = await Promise.all(
    appointments.map(async (appointment) => {
      const patient = await PatientModel.findById(appointment.patientID)
      return patient
    })
  )
  // Filter out null values
  const filteredPatients = patients.filter(
    (patient) => patient !== null
  ) as PatientDocument[]
  // Return the list of patients
  return filteredPatients
}

export async function getApprovedDoctorById(
  doctorId: string
): Promise<DoctorDocumentWithUser> {
  const doctor = await DoctorModel.findById({ _id: doctorId,  requestStatus: 'approved', }).populate<{
    user: UserDocument
  }>('user')

  if (doctor == null) throw new NotFoundError()

  return doctor
}

