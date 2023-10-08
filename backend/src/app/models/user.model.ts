import mongoose from 'mongoose'
import { UserType } from 'clinic-common/types/user.types'

const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    /**
     * This will be useful in the FE, to know which type of user is logged in, so we can
     * then send a request to the correct endpoint to fetch additional information.
     */
    type: { type: String, enum: UserType, required: true },
  },
  { timestamps: true }
)

export type UserDocument = mongoose.InferSchemaType<typeof userSchema>

export const UserModel = mongoose.model('User', userSchema)
