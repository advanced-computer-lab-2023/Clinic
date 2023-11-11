import { uploadMedicalHistoryRequest } from 'clinic-common/types/patient.types'
import { NotFoundError } from '../errors'
import {
  type AppointmentDocument,
  AppointmentModel,
} from '../models/appointment.model'
import { HealthPackageModel } from '../models/healthPackage.model'
import { type PatientDocument, PatientModel } from '../models/patient.model'
import {
  type PrescriptionDocument,
  PrescriptionModel,
} from '../models/prescription.model'
import { UserModel, type UserDocument } from '../models/user.model'
import { type WithUser } from '../utils/typeUtils'
import { type HydratedDocument, type ObjectId } from 'mongoose'
import { getStorage, ref, uploadBytes } from 'firebase/storage'
import { getDownloadURL } from 'firebase/storage'
import FireBase from '../../../../firebase.config'
type PatientDocumentWithUser = WithUser<PatientDocument>
const storage = getStorage(FireBase)
const storageRef = ref(storage, 'petients/medicalHistory')
const storageRef2 = ref(storage, 'petients/HealthRecord')

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

export async function uploadMedicalHistory(
  info: uploadMedicalHistoryRequest
): Promise<void> {
  const { id, medicalHistory } = info
  const fileRef = ref(storageRef, Date.now().toString())

  try {
    await uploadBytes(fileRef, medicalHistory.buffer, {
      contentType: medicalHistory.mimetype,
    })

    console.log('Uploaded a blob or file!')

    const fullPath = await getDownloadURL(fileRef)

    const patient = await PatientModel.findOne({ user: id }).exec()
    if (patient == null) throw new NotFoundError()
    patient.documents.push(fullPath)
    await patient.save()
  } catch (error) {
    console.log('Error uploading file:', error)
  }
}

export async function getMyMedicalHistory(id: string): Promise<string[]> {
  const patient = await PatientModel.findOne({ user: id }).exec()
  if (patient == null) throw new NotFoundError()

  return patient.documents
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

  const appointments: Array<HydratedDocument<AppointmentDocument>> =
    await AppointmentModel.find({
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

  const appointments = (
    await AppointmentModel.find({
      doctorID: doctorId,
      // Since date is stored as a string (by mistake), as a workaround, we can fetch all then filter using JS
      // date: { $gte: new Date() },
    })
  ).filter((a) => new Date(a.date) > new Date())

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

export async function addNoteToPatient(
  id: string,
  newNote: string
): Promise<{
  patient: PatientDocumentWithUser
}> {
  const patient = await PatientModel.findOne({ _id: id })
    .populate<{ user: UserDocument }>('user')
    .exec()
  if (patient == null) throw new NotFoundError()
  patient.notes.push(newNote)
  await patient.save()

  return { patient }
}

export async function getPatientNotes(username: string) {
  const user = await UserModel.findOne({ username })
  const patient = await PatientModel.findOne({ user: user?._id })

  return patient?.notes
}

export async function subscribeToHealthPackage(params: {
  patientUsername: string
  healthPackageId: string
}): Promise<void> {
  const patient = await getPatientByUsername(params.patientUsername)

  if (!patient) {
    throw new NotFoundError()
  }

  const healthPackage = await HealthPackageModel.findById(
    params.healthPackageId
  )

  if (!healthPackage) {
    throw new NotFoundError()
  }

  patient.healthPackage = healthPackage.id

  // Set renewal date to 1 year from now
  const renewalDate = new Date()
  renewalDate.setFullYear(renewalDate.getFullYear() + 1)
  patient.healthPackageRenewalDate = renewalDate

  await patient.save() //removed console.log
}

export async function unSubscribeToHealthPackage(params: {
  patientUsername: string
  healthPackageId: string
}): Promise<void> {
  const patient = await getPatientByUsername(params.patientUsername)

  if (!patient) {
    throw new NotFoundError()
  }

  const healthPackage = await HealthPackageModel.findById(
    params.healthPackageId
  )

  if (!healthPackage) {
    throw new NotFoundError()
  }

  patient.healthPackage = undefined
  patient.healthPackageRenewalDate = undefined

  await patient.save()
}

export async function getPatientByUsername(
  username: string
): Promise<HydratedDocument<PatientDocument> | null> {
  const user = await UserModel.findOne({ username })

  if (!user) {
    throw new NotFoundError()
  }

  return await PatientModel.findOne({ user: user.id })
}

export async function uploadHealthRecords(info: any): Promise<void> {
  const { id, HealthRecord } = info
  const fileRef = ref(storageRef2, Date.now().toString())

  try {
    await uploadBytes(fileRef, HealthRecord.buffer, {
      contentType: HealthRecord.mimetype,
    })

    console.log('Uploaded a blob or file!')

    const fullPath = await getDownloadURL(fileRef)

    const patient = await PatientModel.findOne({ _id: id }).exec()
    if (patient == null) throw new NotFoundError()
    patient.healthRecords.push(fullPath)
    await patient.save()
  } catch (error) {
    console.log('Error uploading file:', error)
  }
}

export async function getHealthRecordsFiles(id: string): Promise<string[]> {
  const patient = await PatientModel.findOne({ _id: id })

  return patient?.healthRecords || []
}

export async function getPatientHealthRecords(
  username: string
): Promise<string[]> {
  const user = await UserModel.findOne({ username })
  const patient = await PatientModel.findOne({ user: user?._id })

  return patient?.healthRecords || []
}
