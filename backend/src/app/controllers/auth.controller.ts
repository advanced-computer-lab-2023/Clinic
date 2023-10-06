import { Router } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import { login, register } from '../services/auth.service'
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
  '/register',
  validate(RegisterRequestValidator),
  asyncWrapper<RegisterRequest>(async (req, res) => {
    const token = await register(req.body)

    res.send(new RegisterResponse(token))
  })
)

// authRouter.get('/getAllPatients',
//     asyncWrapper<RegisterRequest>(async (req, res) => {
//         const patients = await PatientModel.find();
//         res.status(200)
//             .json(
//                 patients
//             )
//
//     }
//
authRouter.post(
  '/login',
  validate(LoginRequestValidator),
  asyncWrapper<LoginRequest>(async (req, res) => {
    const { username, password } = req.body

    const token = await login(username, password)

    res.send(new LoginResponse(token))
  })
)
