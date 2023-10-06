import mongoose from 'mongoose'
import { type Admin } from '../types/admin.types'

const Schema = mongoose.Schema

const adminSchema = new Schema<Admin>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

export const AdminModel = mongoose.model<Admin>('Admin', adminSchema)
