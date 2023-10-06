import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'
import { type HydratedDocument } from 'mongoose'
import { UserModel } from '../models/userModel'
import { TokenError, LoginError } from '../errors/authErrors'
import type { User } from '../types/user'
import { APIError } from '../errors'
import { AdminModel } from '../models/adminModel'

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

export async function register(user: User): Promise<HydratedDocument<User>> {
  const hashedPassword = await bcrypt.hash(user.password, bcryptSalt)

  const newUser = new UserModel({
    username: user.username,
    password: hashedPassword,
  })

  await newUser.save()

  return newUser
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
