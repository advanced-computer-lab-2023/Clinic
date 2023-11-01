import { Router } from 'express'
import { validate } from '../middlewares/validation.middleware'

import { AddAdminValidator } from 'clinic-common/validators/admin.validation'
import { asyncWrapper } from '../utils/asyncWrapper'
import {
  type AddAdminRequest,
  GetUsersResponse,
  UsersResponse,
} from 'clinic-common/types/admin.types'
import {
  addAdmin,
  getUsersRequest,
  removeUser,
} from '../services/admin.service'
import { type UserDocument } from '../models/user.model'

export const adminRouter = Router()

adminRouter.post(
  '/',
  validate(AddAdminValidator),
  asyncWrapper<AddAdminRequest>(async (req, res) => {
    const addAdminResponse = await addAdmin(req.body)
    res.send(addAdminResponse)
  })
)
adminRouter.delete(
  '/username/:username',
  asyncWrapper(async (req, res) => {
    await removeUser(req.params.username)
    res.sendStatus(204)
  })
)
adminRouter.get(
  '/get-users',
  asyncWrapper(async (req, res) => {
    const users = await getUsersRequest()
    res.send(
      new GetUsersResponse(
        users.map((user: UserDocument) => {
          return new UsersResponse(user.username, user.type)
        })
      )
    )
  })
)
