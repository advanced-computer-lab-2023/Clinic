import { Router } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import {
  createFamilyMember,
  getFamilyMembers,
} from '../services/familyMember.service'
import {
  type AddFamilyMemberRequest,
  AddFamilyMemberResponse,
  GetFamilyMembersResponse,
  type Relation,
} from 'clinic-common/types/familyMember.types'
import { allowAuthenticated } from '../middlewares/auth.middleware'
import { AddFamilyMemberRequestValidator } from 'clinic-common/validators/familyMembers.validator'
import { validate } from '../middlewares/validation.middleware'
import { type Gender } from 'clinic-common/types/gender.types'

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

// Get all family members of a patient with the given username
familyMemberRouter.get(
  '/:username',
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
