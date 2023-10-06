import { Router } from 'express'
import { asyncWrapper } from '../utils/asyncWrapper'
import { login, register } from '../services/auth'
import type { User } from '../types/user'
import { validate } from '../middlewares/validation'
import { UserValidator } from '../validators/userValidator'

export const authRouter = Router()

// This is just a temporary endpoint to test the login and register functionality
authRouter.post(
  '/register',
  validate(UserValidator),
  asyncWrapper(async (req, res) => {
    const { username, password } = req.body

    res.send(
      await register({
        username,
        password,
      })
    )
  })
)

authRouter.post(
  '/login',
  asyncWrapper<User>(async (req, res) => {
    const { username, password } = req.body

    const token = await login(username, password)

    res.send({ token })
  })
)
