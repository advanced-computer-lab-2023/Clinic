import { Router } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import {
  createFamilyMember,
  findFamilyMemberByEmail,
  findFamilyMemberByMobileNumber,
  findLinkingMe,
  getFamilyMemberById,
  getFamilyMembers,
  getLinkedFamilyMembers,
  getPatientForFamilyMember,
} from '../services/familyMember.service'
import {
  type AddFamilyMemberRequest,
  GetFamilyMembersResponse,
  type Relation,
  GetFamilyMemberResponse,
  type LinkFamilyMemberRequest,
  GetLinkedFamilyMembersResponse,
} from 'clinic-common/types/familyMember.types'
import { allowAuthenticated } from '../middlewares/auth.middleware'
import {
  AddFamilyMemberRequestValidator,
  LinkFamilyMemberRequestValidator,
} from 'clinic-common/validators/familyMembers.validator'
import { validate } from '../middlewares/validation.middleware'
import { type Gender } from 'clinic-common/types/gender.types'
import { GetPatientLinkingMeResponse } from 'clinic-common/types/patient.types'
import { FamilyMemberModel } from '../models/familyMember.model'
import { PatientModel } from '../models/patient.model'
import { UserModel } from '../models/user.model'
import { getHealthPackageNameById } from '../services/healthPackage.service'

export const familyMemberRouter = Router()

// Get all family members of the currently logged in patient
familyMemberRouter.get(
  '/mine',
  allowAuthenticated,
  asyncWrapper(async (req, res) => {
    const familyMembers = await getFamilyMembers(req.username as string)

    const familyMembersResponse = familyMembers.map((familyMember) => ({
      id: familyMember.id,
      name: familyMember.name,
      nationalId: familyMember.nationalId,
      age: familyMember.age,
      gender: familyMember.gender as Gender,
      relation: familyMember.relation as Relation,
      healthPackage: {
        name: familyMember.healthPackage?.name,
        id: familyMember.healthPackage?.id.toString(),
        renewalDate: familyMember.healthPackageRenewalDate?.toDateString(),
      },
      healthPackageHistory: [], //empty array because we dont really need it
    })) satisfies GetFamilyMembersResponse

    res.send(familyMembersResponse)
  })
)

// Get all family members of the currently logged in patient
familyMemberRouter.get(
  '/mine/linked',
  allowAuthenticated,
  asyncWrapper(async (req, res) => {
    const familyMembers = await getLinkedFamilyMembers(req.username as string)

    const familyMembersResponse = familyMembers.map((familyMember) => ({
      id: familyMember.id,
      patientId: familyMember.patient.id.toString(),
      username: familyMember.patient!.user.username,
      mobileNumber: familyMember.patient!.mobileNumber,
      email: familyMember.patient!.email,
      dateOfBirth: familyMember.patient!.dateOfBirth?.toDateString(),
      name: familyMember.patient.name,
      gender: familyMember.patient.gender,
      relation: familyMember.relation as Relation,
      healthPackage: {
        name: familyMember.patient.healthPackage?.name,
        id: familyMember.patient.healthPackage?.id.toString(),
      },
    })) satisfies GetLinkedFamilyMembersResponse

    res.send(familyMembersResponse)
  })
)

familyMemberRouter.post(
  '/link',
  validate(LinkFamilyMemberRequestValidator),
  asyncWrapper<LinkFamilyMemberRequest>(async (req: any, res: any) => {
    let familyMember = null

    if (req.body.email) {
      const familyMemberEmail = req.body.email
      familyMember = await findFamilyMemberByEmail(familyMemberEmail)
    } else if (req.body.phonenumber) {
      const familyMemberMobileNumber = req.body.phonenumber
      familyMember = await findFamilyMemberByMobileNumber(
        familyMemberMobileNumber
      )
    } else {
      throw new Error('No email or mobile number provided')
    }

    const calculatedAge =
      familyMember?.dateOfBirth != null
        ? new Date().getFullYear() - familyMember.dateOfBirth!.getFullYear()
        : undefined

    const newFamilyMember = new FamilyMemberModel({
      name: familyMember?.name,
      nationalId: 'N/A',
      age: calculatedAge,
      gender: familyMember?.gender,
      relation: req.body.relation,
      healthPackage: familyMember?.healthPackage,
      patient: familyMember?._id,
    })
    await newFamilyMember.save()
    const user = await UserModel.findOne({ username: req.username })
    const currentUser = await PatientModel.findOne({ user: user?._id })
    if (currentUser == null)
      return res.status(404).json({ error: 'Current user not found' })
    currentUser.familyMembers.push(newFamilyMember._id)

    await currentUser.save()

    res.send(familyMember)
  })
)

// Get all patients that are linked to the currently logged in family member

familyMemberRouter.get(
  '/linking-me',
  asyncWrapper(async (req, res) => {
    const patients = await findLinkingMe(req.username as string)
    // Extract only the names from the patients array
    const patientNames = patients.map((patient) => patient.name)

    res.send(new GetPatientLinkingMeResponse(patientNames))
  })
)

// Create a family member for the patient with the given username
familyMemberRouter.post(
  '/:patientUsername',
  validate(AddFamilyMemberRequestValidator),
  asyncWrapper<AddFamilyMemberRequest>(async (req, res) => {
    await createFamilyMember(req.params.patientUsername, req.body)

    res.status(201).send()
  })
)

// Get one family member by ID alongside their related patient
familyMemberRouter.get(
  '/:familyMemberId',
  asyncWrapper(async (req, res) => {
    const familyMember = await getFamilyMemberById(req.params.familyMemberId)
    const patient = await getPatientForFamilyMember(req.params.familyMemberId)

    const healthPackageHistory = await Promise.all(
      familyMember.healthPackageHistory
        .filter(
          (hp) =>
            hp.healthPackage.toString() !=
            familyMember.healthPackage?.id.toString()
        )
        .map(async (historyEntry) => {
          const healthPackageName = await getHealthPackageNameById(
            historyEntry.healthPackage?.toString()
          )

          return {
            package: healthPackageName,
            date: historyEntry.date,
          }
        })
    )

    res.send({
      familyMember: {
        id: familyMember.id,
        name: familyMember.name,
        nationalId: familyMember.nationalId,
        age: familyMember.age,
        gender: familyMember.gender as Gender,
        relation: familyMember.relation as Relation,
        healthPackage: {
          name: familyMember.healthPackage?.name,
          renewalDate: familyMember.healthPackageRenewalDate?.toDateString(),
          id: familyMember.healthPackage?.toString(),
        },
        healthPackageHistory,
      },
      patient: {
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
      },
    } satisfies GetFamilyMemberResponse)
  })
)
