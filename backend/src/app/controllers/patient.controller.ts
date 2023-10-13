import { Router } from 'express'

import { asyncWrapper } from '../utils/asyncWrapper'
import {
  filterPatientByAppointment,
  getPatientByID,
  getPatientByName,
} from '../services/patient.service'
import {
  APatientResponseBase,
  GetPatientResponse,
} from 'clinic-common/types/patient.types'

import {
  allowApprovedDoctorOfPatient,
  allowApprovedDoctors,
} from '../middlewares/auth.middleware'
import { type Gender } from 'clinic-common/types/gender.types'
import { getFamilyMembers } from '../services/familyMember.service'
import {
  GetFamilyMembersResponse,
  type Relation,
} from 'clinic-common/types/familyMember.types'

export const patientRouter = Router()

patientRouter.get(
  '/:id',
  asyncWrapper(allowApprovedDoctorOfPatient),
  asyncWrapper(async (req, res) => {
    const id = req.params.id

    const { patient, appointments, prescriptions } = await getPatientByID(id)
    res.send(
      new APatientResponseBase(
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
        appointments,
        prescriptions
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
        }))
      )
    )
  })
)

patientRouter.post(
  '/filter',
  asyncWrapper(allowApprovedDoctors),
  asyncWrapper(async (req, res) => {
    const doctorID = req.body.doctorID
    const patientsIDs = req.body.patients

    const patients = await filterPatientByAppointment(patientsIDs, doctorID)
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
