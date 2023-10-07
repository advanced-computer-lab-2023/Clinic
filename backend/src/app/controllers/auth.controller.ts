import { Router } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import {
  getUserByUsername,
  isAdmin,
  login,
  registerPatient,
  submitDoctorRequest,
} from '../services/auth.service'
import { validate } from '../middlewares/validation.middleware'
import {
  LoginRequestValidator,
  RegisterRequestValidator,
} from '../validators/user.validator'
import {
  LoginResponse,
  type LoginRequest,
  type RegisterRequest,
  RegisterResponse,
} from '../types/auth.types'
import { allowAuthenticated } from '../middlewares/auth.middleware'
import { NotAuthorizedError } from '../errors/auth.errors'
import {
  GetCurrentUserResponse,
  GetUserByUsernameResponse,
  type UserType,
} from '../types/user.types'
import { RegisterDoctorRequestValidator } from '../validators/doctor.validator'
import { RegisterDoctorRequestResponse } from '../types/doctor.types'

export const authRouter = Router()

authRouter.post(
  '/register-patient',
  validate(RegisterRequestValidator),
  asyncWrapper<RegisterRequest>(async (req, res) => {
    const token = await registerPatient(req.body)
    res.send(new RegisterResponse(token))
  })
)

authRouter.post(
  '/login',
  validate(LoginRequestValidator),
  asyncWrapper<LoginRequest>(async (req, res) => {
    const { username, password } = req.body
    const token = await login(username, password)
    res.send(new LoginResponse(token))
  })
)

/**
 * Get the currently logged in user
 */
authRouter.get(
  '/me',
  allowAuthenticated,
  asyncWrapper(async (req, res) => {
    const user = await getUserByUsername(req.username as string)
    res.send(
      new GetCurrentUserResponse(user.id, user.username, user.type as UserType)
    )
  })
)

authRouter.get(
  '/:username',
  allowAuthenticated,
  asyncWrapper(async (req, res) => {
    // Only admins and the user itself can access this endpoint
    if (
      req.params.username !== req.username &&
      !(await isAdmin(req.username as string))
    ) {
      throw new NotAuthorizedError()
    }

    const user = await getUserByUsername(req.params.username)

    res.send(
      new GetUserByUsernameResponse(
        user.id,
        user.username,
        user.type as UserType
      )
    )
  })
)

// Submit a Request to Register as a Doctor
authRouter.post(
  '/request-doctor',
  validate(RegisterDoctorRequestValidator),
  asyncWrapper(async (req, res) => {
    const doctor = await submitDoctorRequest(req.body)
    res.send(
      new RegisterDoctorRequestResponse(
        doctor.id,
        doctor.user.username,
        doctor.name,
        doctor.email,
        doctor.dateOfBirth,
        doctor.hourlyRate,
        doctor.affiliation,
        doctor.educationalBackground
      )
    )
  })
)
