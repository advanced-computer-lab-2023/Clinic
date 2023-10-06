import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'
import { UserModel } from '../models/user.model'
import {
  TokenError,
  LoginError,
  UsernameAlreadyTakenError,
} from '../errors/auth.errors'
import { APIError } from '../errors'
import { AdminModel } from '../models/admin.model'
import { type RegisterRequest } from '../types/auth.types'

const jwtSecret = process.env.JWT_TOKEN ?? 'secret'
const bcryptSalt = process.env.BCRYPT_SALT ?? '$2b$10$13bXTGGukQXsCf5hokNe2u'

export class JwtPayload {
  constructor(public username: string) {}
}

export async function login(
  username: string,
  password: string
): Promise<string> {
  const user = await UserModel.findOne({ username })

  if (user == null) {
    throw new LoginError()
  }

  const hashedPassword = await bcrypt.hash(password, bcryptSalt)

  if (user.password !== hashedPassword) {
    throw new APIError('Password is incorrect', 400)
  }

  const payload = new JwtPayload(username)

  return await generateJWTToken(payload)
}

export async function register(request: RegisterRequest): Promise<string> {
  if (await isUsernameTaken(request.username)) {
    throw new UsernameAlreadyTakenError()
  }

  const hashedPassword = await bcrypt.hash(request.password, bcryptSalt)

  const newUser = await UserModel.create({
    username: request.username,
    password: hashedPassword,
  })

  return await generateJWTToken(new JwtPayload(newUser.username))
}

export async function isUsernameTaken(username: string): Promise<boolean> {
  return (await UserModel.count({ username })) > 0
}

export async function verifyJWTToken(token: string): Promise<JwtPayload> {
  return await new Promise((resolve, reject) => {
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err != null || decoded == null) {
        reject(new TokenError())
      } else {
        resolve(decoded as JwtPayload)
      }
    })
  })
}

export async function generateJWTToken(payload: JwtPayload): Promise<string> {
  return await new Promise((resolve, reject) => {
    jwt.sign({ ...payload }, jwtSecret, { expiresIn: '1h' }, (err, token) => {
      if (err != null || token == null) {
        reject(err)
      } else {
        resolve(token)
      }
    })
  })
}

export async function isAdmin(username: string): Promise<boolean> {
  const user = await UserModel.findOne({ username })

  if (user == null) {
    return false
  }

  const admin = await AdminModel.findOne({ user: user.id })

  return admin != null
}
