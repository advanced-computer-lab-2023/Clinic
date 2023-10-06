import { Router } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import { login } from '../services/auth.service'
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
import { PatientModel } from '../models/patient.model'
import jwt from 'jsonwebtoken'
import { UsernameAlreadyTakenError } from '../errors/auth.errors'

export const authRouter = Router()

authRouter.post(
  '/register',
  validate(RegisterRequestValidator),
  asyncWrapper<RegisterRequest>(async (req, res) => {
    const {
      username,
      name,
      email,
      password,
      dateOfBirth,
      gender,
      mobileNumber,
      emergencyContact: {
        emergencyContactName,
        mobileNumber: emergencyMobileNumber,
        // relation: emergencyRelation,
      },
    } = req.body
    const patientDuplicate = await PatientModel.findOne({ username })
    if (patientDuplicate !== null) {
      throw new UsernameAlreadyTakenError()
    }

    const patient = await PatientModel.create({
      username,
      name,
      email,
      password,
      dateOfBirth,
      gender,
      mobileNumber,
      emergencyContact: {
        emergencyContactName,
        mobileNumber: emergencyMobileNumber,
      },
    })
    await patient.save()
    // const secret: string = process.env.JWT_SECRET || 'secret';
    const secret: string = process.env.JWT_SECRET ?? 'secret'

    const expiresIn = '30d'
    console.log('done here')
    const newToken = jwt.sign(
      {
        username: patient.username,
        id: patient._id,
        password: patient.password,
        role: 'PATIENT',
      },
      secret,
      { expiresIn }
    )
    const response = new RegisterResponse(newToken)
    res.status(200).json(response)
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
