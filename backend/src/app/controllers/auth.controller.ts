import { Router } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import { getUserByUsername, isAdmin, login, register } from '../services/auth.service'
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
import { GetUserByUsernameResponse, type UserType } from '../types/user.types'

export const authRouter = Router()

// This is just a temporary endpoint to test the login and register functionality
authRouter.post(
  '/register',
  validate(RegisterRequestValidator),
  asyncWrapper<RegisterRequest>(async (req, res) => {
    res.send(new RegisterResponse(await register(req.body)))
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
