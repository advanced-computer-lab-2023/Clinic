import { Router } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import {
  createFamilyMember,
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
} from 'clinic-common/types/familyMember.types'
import { allowAuthenticated } from '../middlewares/auth.middleware'
import { AddFamilyMemberRequestValidator } from 'clinic-common/validators/familyMembers.validator'
import { validate } from '../middlewares/validation.middleware'
import { type Gender } from 'clinic-common/types/gender.types'
import { PatientResponseBase } from 'clinic-common/types/patient.types'

export const familyMemberRouter = Router()

// Get all family members of the currently logged in patient
familyMemberRouter.get(
  /**
   * Renamed from '/view' to '/mine', makes more sense to say `/family-member/mine`
   * to get my family members than `/family-member/view` which might be confused
   * with gettings all family members, not just mine.
   */
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
