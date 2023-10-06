import mongoose from 'mongoose'
import type { User } from '../types/user.types'

const Schema = mongoose.Schema

const userSchema = new Schema<User>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
)

export const UserModel = mongoose.model<User>('User', userSchema)
