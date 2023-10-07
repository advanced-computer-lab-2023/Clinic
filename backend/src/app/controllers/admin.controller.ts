import { Router } from 'express'
import { validate } from '../middlewares/validation.middleware'
import { AddAnotherAdminValidator } from '../validators/admin.validation'
import { asyncWrapper } from '../utils/asyncWrapper'
import { type AddAdminRequest } from '../types/admin.types'
import { addAdmin } from '../services/admin.service'

export const adminRouter = Router()
adminRouter.post(
  '/',
  validate(AddAnotherAdminValidator),
  asyncWrapper<AddAdminRequest>(async (req, res) => {
    const addAnotherAdminResponse = await addAdmin(req.body)
    res.send(addAnotherAdminResponse)
  })
)
