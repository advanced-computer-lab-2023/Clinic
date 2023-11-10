import { Router } from 'express'

import { asyncWrapper } from '../utils/asyncWrapper'
import {
  filterPatientByAppointment,
  getPatientByID,
  getPatientByName,
  getMyPatients,
  addNoteToPatient,
  getPatientByUsername,
  getPatientNotes,
} from '../services/patient.service'
import {
  GetAPatientResponse,
  GetMyPatientsResponse,
  GetPatientResponse,
  GetWalletMoneyResponse,
} from 'clinic-common/types/patient.types'

import { allowApprovedDoctors } from '../middlewares/auth.middleware'
import { type Gender } from 'clinic-common/types/gender.types'
import { type HydratedDocument } from 'mongoose'
import { type UserDocument, UserModel } from '../models/user.model'
import { NotAuthenticatedError } from '../errors/auth.errors'
import { NotFoundError } from '../errors/index'
import { DoctorModel } from '../models/doctor.model'
import { getFamilyMembers } from '../services/familyMember.service'
import {
  GetFamilyMembersResponse,
  type Relation,
} from 'clinic-common/types/familyMember.types'
import {
  AppointmentResponseBase,
  GetFilteredAppointmentsResponse,
} from 'clinic-common/types/appointment.types'

export const patientRouter = Router()

patientRouter.get(
  '/viewHealthRecords/me',
  asyncWrapper(async (req, res) => {
    const result = await getPatientNotes(req.username || '')
    res.send(result)
  })
)
patientRouter.patch(
  '/addNote/:id',
  asyncWrapper(async (req, res) => {
    const id = req.params.id
    const newNote = req.body.newNote
    const result = await addNoteToPatient(id, newNote)
    res.send(result)
  })
)

patientRouter.get(
  '/myPatients', //  allowAuthenticated,
  asyncWrapper(async (req, res) => {
    const user: HydratedDocument<UserDocument> | null = await UserModel.findOne(
      { username: req.username }
    )
    if (user == null) throw new NotAuthenticatedError()
    const doctor = await DoctorModel.findOne({ user: user.id })
    if (doctor == null) throw new NotAuthenticatedError()
    const patients = await getMyPatients(doctor.id)
    res.send(
      new GetMyPatientsResponse(
        patients.map((patient) => ({
          id: patient.id,
          name: patient.name,
          email: patient.email,
          mobileNumber: patient.mobileNumber,
          dateOfBirth: patient.dateOfBirth.toDateString(),
          gender: patient.gender as Gender,
          emergencyContact: {
            name: patient.emergencyContact?.name ?? '',
            mobileNumber: patient.emergencyContact?.mobileNumber ?? '',
          },
          familyMembers: patient.familyMembers.map((familyMember) =>
            familyMember.toString()
          ),
        }))
      )
    )
  })
)

patientRouter.get(
  '/search',
  asyncWrapper(allowApprovedDoctors),
  asyncWrapper(async (req, res) => {
    const name = req.query.name as string

    const patients = await getPatientByName(name)
    res.send(
      new GetPatientResponse(
        patients.map((patient) => ({
          id: patient.id,
          username: patient.user.username,
          name: patient.name,
          email: patient.email,
          mobileNumber: patient.mobileNumber,
          dateOfBirth: patient.dateOfBirth,
          gender: patient.gender as Gender,
          emergencyContact: {
            name: patient.emergencyContact?.name ?? '',
            mobileNumber: patient.emergencyContact?.mobileNumber ?? '',
          },
          notes: patient.notes,
        }))
      )
    )
  })
)

patientRouter.post(
  '/filter',
  asyncWrapper(allowApprovedDoctors),
  asyncWrapper(async (req, res) => {
    const user: HydratedDocument<UserDocument> | null = await UserModel.findOne(
      { username: req.username }
    )
    if (user == null) throw new NotAuthenticatedError()
    const doctor = await DoctorModel.findOne({ user: user.id })
    if (doctor == null) throw new NotAuthenticatedError()
    const patients = await filterPatientByAppointment(doctor.id)
    res.send(
      new GetPatientResponse(
        patients.map((patient) => ({
          id: patient.id,
          username: patient.user.username,
          name: patient.name,
          email: patient.email,
          mobileNumber: patient.mobileNumber,
          dateOfBirth: patient.dateOfBirth,
          gender: patient.gender as Gender,
          emergencyContact: {
            name: patient.emergencyContact?.name ?? '',
            mobileNumber: patient.emergencyContact?.mobileNumber ?? '',
          },
          notes: patient.notes,
        }))
      )
    )
  })
)

// Get all family members of a patient with the given username
patientRouter.get(
  '/:username/family-members',
  asyncWrapper(async (req, res) => {
    const familyMembers = await getFamilyMembers(req.params.username)

    res.send(
      new GetFamilyMembersResponse(
        familyMembers.map((familyMember) => ({
          id: familyMember.id,
          name: familyMember.name,
          nationalId: familyMember.nationalId,
          age: familyMember.age,
          gender: familyMember.gender as Gender,
          relation: familyMember.relation as Relation,
        }))
      )
    )
  })
)

// get the wallet money of a patient with the given username
patientRouter.get(
  '/wallet/:username',
  asyncWrapper(async (req, res) => {
    const patient = await getPatientByUsername(req.params.username)
    if (!patient) throw new NotFoundError()
    res.send(new GetWalletMoneyResponse(patient.walletMoney))
  })
)

patientRouter.get(
  '/:id',
  // asyncWrapper(allowApprovedDoctorOfPatient),
  asyncWrapper(async (req, res) => {
    const id = req.params.id
    const user = await UserModel.findOne({ username: req.username })
    const doctor = await DoctorModel.findOne({ user: user?.id })

    const { patient, appointments, prescriptions } = await getPatientByID(id)

    const filteredAppointments = appointments
      .filter((appointment) => appointment.doctorID.toString() === doctor?.id)
      .map((appointment) => {
        return new AppointmentResponseBase(
          appointment.id,
          appointment.patientID.toString(),
          appointment.doctorID.toString(),
          appointment.date
        )
      })

    const appointmentsRefactored = new GetFilteredAppointmentsResponse(
      filteredAppointments
    )
    res.send(
      new GetAPatientResponse(
        patient.id,
        patient.user.username,
        patient.name,
        patient.email,
        patient.mobileNumber,
        patient.dateOfBirth,
        patient.gender as Gender,
        {
          name: patient.emergencyContact?.name ?? '',
          mobileNumber: patient.emergencyContact?.mobileNumber ?? '',
        },
        patient.documents,
        appointmentsRefactored,
        prescriptions,
        patient.notes,
        patient.walletMoney
      )
    )
  })
)
