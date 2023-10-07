import { Router } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import { getRegisteredFamilyMembers } from '../services/familyMember.service'

export const familyMemberRouter = Router()

familyMemberRouter.get(
  '/view',
  asyncWrapper(async (req, res) => {
    const registeredFamilyMembers = await getRegisteredFamilyMembers(
      req.username
    )

    res.send(registeredFamilyMembers)
  })
)
