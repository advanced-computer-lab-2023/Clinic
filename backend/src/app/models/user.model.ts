import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
)

export type UserDocument = mongoose.InferSchemaType<typeof userSchema>

export const UserModel = mongoose.model('User', userSchema)
