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
import { UserModel, type UserDocument } from '../models/user.model'
import { type WithUser } from '../utils/typeUtils'
import { type ObjectId } from 'mongoose'


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
  appointments: AppointmentDocument[]
  prescriptions: PrescriptionDocument[]
}> {
  const patient = await PatientModel.findOne({ _id: id })
    .populate<{ user: UserDocument }>('user')
    .exec()
  if (patient == null) throw new NotFoundError()

  const appointments = await AppointmentModel.find({
    patientID: id,
  }).exec()

  const prescriptions = await PrescriptionModel.find({
    patient: id,
  }).exec()

  return { patient, appointments, prescriptions }
}

export async function filterPatientByAppointment(
  patients: string[],
  doctorId: string
): Promise<PatientDocumentWithUser[]> {
  const filteredPatients = []
  for (const patient of patients) {
    const appointments = await AppointmentModel.find({
      patientID: patient,
      doctorID: doctorId,
      status: AppointmentStatus.Upcoming,
    })
    if (appointments.length > 0) {
      filteredPatients.push(patient)
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
): Promise<PatientDocument[]> {
  // Find all appointments with the given doctorId
  const appointments = await AppointmentModel.find({ doctorID: doctorId })
  // Get all unique patient IDs who had appointments with the doctor
  const uniquePatientIds = new Set(appointments.map(appointment => appointment.patientID))
 // Retrieve the corresponding patients from the database
 const patients = await Promise.all(
  Array.from(uniquePatientIds).map(async (patientId) => {
    const patient = await PatientModel.findById(patientId)
    return patient
  })
)
console.log(patients)
  // Filter out null values
  const filteredPatients = patients.filter(
    (patient) => patient !== null
  ) as PatientDocument[]
  // Return the list of patients
  return filteredPatients
}


