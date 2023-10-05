import { Router } from 'express'

import { login, register } from './app/controllers/auth'

export const router = Router()

router.get('/login', login)
router.get('/register', register)
