import { Router } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import { login, registerPatient } from '../services/auth.service'
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
