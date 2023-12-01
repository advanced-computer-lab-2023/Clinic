import mongoose from 'mongoose'

const Schema = mongoose.Schema

const adminSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    email: { type: String, required: true, unique: true },
  },

  { timestamps: true }
)

export type AdminDocument = mongoose.InferSchemaType<typeof adminSchema>

export const AdminModel = mongoose.model('Administrator', adminSchema)
