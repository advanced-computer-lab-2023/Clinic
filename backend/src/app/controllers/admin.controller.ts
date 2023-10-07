import { Router } from 'express'
import { validate } from '../middlewares/validation.middleware'
import { AddAnotherAdminValidator } from '../validators/admin.validation'
import { asyncWrapper } from '../utils/asyncWrapper'
import { type AddAnotherAdminRequest } from '../types/admin.types'
import { AddAnotherAdmin } from '../services/admin.service'

export const adminRouter = Router()
adminRouter.post(
  '/add-Another-Admin',
  validate(AddAnotherAdminValidator),
  asyncWrapper<AddAnotherAdminRequest>(async (req, res) => {
    const addAnotherAdminResponse = await AddAnotherAdmin(req.body)
    res.send(addAnotherAdminResponse)
  })
)
