import { Router } from 'express'
import { validate } from '../middlewares/validation.middleware'

import {
  AddAdminValidator,
  RemoveUserResponse,
  RemoveUserValidator,
} from '../validators/admin.validation'
import { asyncWrapper } from '../utils/asyncWrapper'
import {
  type AddAdminRequest,
  type RemoveUserRequest,
} from '../types/admin.types'
import { addAdmin, removeUser } from '../services/admin.service'

export const adminRouter = Router()
adminRouter.post(
  '/',
  validate(AddAdminValidator),
  asyncWrapper<AddAdminRequest>(async (req, res) => {
    const addAdminResponse = await addAdmin(req.body)
    res.send(addAdminResponse)
  })
)
adminRouter.post(
  '/remove-user',
  validate(RemoveUserValidator),
  asyncWrapper<RemoveUserRequest>(async (req, res) => {
    await removeUser(req.body)
    res.send(new RemoveUserResponse(req.body.username))
  })
)
