import { AppointmentStatus } from 'clinic-common/types/appointment.types'
import { NotFoundError } from '../errors'
import {
  type AppointmentDocument,
  AppointmentModel,
} from '../models/appointment.model'
import { type PatientDocument, PatientModel } from '../models/patient.model'
import {
  type PrescriptionDocument,
  PrescriptionModel,
} from '../models/prescription.model'
import { type UserDocument } from '../models/user.model'
import { type WithUser } from '../utils/typeUtils'
import { type HydratedDocument, type ObjectId } from 'mongoose'

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

export async function getPatientByID(id: string): Promise<{
  patient: PatientDocumentWithUser
  appointments: Array<HydratedDocument<AppointmentDocument>>
  prescriptions: PrescriptionDocument[]
}> {
  const patient = await PatientModel.findOne({ _id: id })
    .populate<{ user: UserDocument }>('user')
    .exec()
  if (patient == null) throw new NotFoundError()

  const appointments : Array<HydratedDocument<AppointmentDocument>> = await AppointmentModel.find({
    patientID: id,
  }).exec()

  const prescriptions = await PrescriptionModel.find({
    patient: id,
  }).exec()

  return { patient, appointments, prescriptions }
}

export async function filterPatientByAppointment(
  doctorId: string
): Promise<PatientDocumentWithUser[]> {
  const filteredPatients: string[] = []

  const appointments = await AppointmentModel.find({
    doctorID: doctorId,
    status: AppointmentStatus.Upcoming,
  })
  for (const appointment of appointments) {
    const patientId = appointment.patientID.toString()
    if (!filteredPatients.includes(patientId)) {
      filteredPatients.push(patientId)
    }
  }
  const patientsDocs = await PatientModel.find({
    _id: { $in: filteredPatients },
  })
    .populate<{ user: UserDocument }>('user')
    .exec()
  return patientsDocs
}

// Define the function to get all patients of a doctor
export async function getMyPatients(
  doctorId: ObjectId
): Promise<Array<HydratedDocument<PatientDocument>>> {
  // Find all appointments with the given doctorId
  const appointments = await AppointmentModel.find({ doctorID: doctorId })
  // Create a map of unique patient IDs to their corresponding patient documents
  const patientMap = new Map<string, PatientDocument>()
  for (const appointment of appointments) {
    const patientId = appointment.patientID.toString()
    if (!patientMap.has(patientId)) {
      const patient: HydratedDocument<PatientDocument> | null =
        await PatientModel.findById(patientId)
      if (patient != null) {
        patientMap.set(patientId, patient)
      }
    }
  }
  // Return the list of unique patients
  const uniquePatients = Array.from(patientMap.values())
  // Filter out null values
  const filteredPatients = uniquePatients.filter(
    (patient) => patient !== null
  ) as Array<HydratedDocument<PatientDocument>>
  // Return the list of patients
  return filteredPatients
}
