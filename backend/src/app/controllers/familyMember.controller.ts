import { Router } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import { getFamilyMembers } from '../services/familyMember.service'
import { GetFamilyMembersResponse } from '../types/familyMember.types'
import { allowAuthenticated } from '../middlewares/auth.middleware'

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
          gender: familyMember.gender,
          relation: familyMember.relation,
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
          gender: familyMember.gender,
          relation: familyMember.relation,
        }))
      )
    )
  })
)
