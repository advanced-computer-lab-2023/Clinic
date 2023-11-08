 
import { Router } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import {
  createFamilyMember,
  findFamilyMemberByEmail,
  findFamilyMemberByMobileNumber,
  getFamilyMemberById,
  getFamilyMembers,
  getPatientForFamilyMember,
} from '../services/familyMember.service'
import {
  type AddFamilyMemberRequest,
  AddFamilyMemberResponse,
  GetFamilyMembersResponse,
  type Relation,
  GetFamilyMemberResponse,
  FamilyMemberResponseBase,
  type LinkFamilyMemberRequest,
} from 'clinic-common/types/familyMember.types'
import { allowAuthenticated } from '../middlewares/auth.middleware'
import {
  AddFamilyMemberRequestValidator,
  LinkFamilyMemberRequestValidator,
} from 'clinic-common/validators/familyMembers.validator'
import { validate } from '../middlewares/validation.middleware'
import { type Gender } from 'clinic-common/types/gender.types'
import { PatientResponseBase } from 'clinic-common/types/patient.types'
import { FamilyMemberModel } from '../models/familyMember.model'
import { PatientModel } from '../models/patient.model'
import { UserModel } from '../models/user.model'

export const familyMemberRouter = Router()

// Get all family members of the currently logged in patient
familyMemberRouter.get(
  '/mine',
  allowAuthenticated,
  asyncWrapper(async (req, res) => {
    const familyMembers = await getFamilyMembers(req.username as string)

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

familyMemberRouter.post(
  '/link',
  validate(LinkFamilyMemberRequestValidator),
  asyncWrapper<LinkFamilyMemberRequest>(async (req: any, res: any) => {
    let familyMember = null

    if (req.body.email != null) {
      const familyMemberEmail = req.body.email
      familyMember = await findFamilyMemberByEmail(familyMemberEmail)
    } else if (req.body.mobileNumber != null) {
      const familyMemberMobileNumber = req.body.mobileNumber
      familyMember = await findFamilyMemberByMobileNumber(
        familyMemberMobileNumber
      )
    }

    // else{
    // TODO: throw error
    // }
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
// Create a family member for the patient with the given username
familyMemberRouter.post(
  '/:patientUsername',
  validate(AddFamilyMemberRequestValidator),
  asyncWrapper<AddFamilyMemberRequest>(async (req, res) => {
    const newFamilyMember = await createFamilyMember(
      req.params.patientUsername,
      req.body
    )

    res.send(
      new AddFamilyMemberResponse(
        newFamilyMember.id,
        newFamilyMember.name,
        newFamilyMember.nationalId,
        newFamilyMember.age,
        newFamilyMember.gender as Gender,
        newFamilyMember.relation as Relation
      )
    )
  })
)

// Get one family member by ID alongside their related patient
familyMemberRouter.get(
  '/:familyMemberId',
  asyncWrapper(async (req, res) => {
    const familyMember = await getFamilyMemberById(req.params.familyMemberId)
    const patient = await getPatientForFamilyMember(req.params.familyMemberId)

    res.send(
      new GetFamilyMemberResponse(
        new FamilyMemberResponseBase(
          familyMember.id,
          familyMember.name,
          familyMember.nationalId,
          familyMember.age,
          familyMember.gender as Gender,
          familyMember.relation as Relation
        ),
        new PatientResponseBase(
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
          patient.notes
        )
      )
    )
  })
)
