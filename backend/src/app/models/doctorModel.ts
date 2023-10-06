import mongoose from 'mongoose'
import { type Doctor, DoctorStatus } from '../types/doctor'

const Schema = mongoose.Schema

const doctorSchema = new Schema<Doctor>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dateOfBirth: { type: Date, required: true },
    hourlyRate: { type: Number, required: true },
    affiliation: { type: String, required: true },
    educationalBackground: { type: String, required: true },
    requestStatus: {
      type: String,
      required: true,
      enum: DoctorStatus,
      default: DoctorStatus.Pending,
    },
  },
  { timestamps: true }
)

export const DoctorModel = mongoose.model<Doctor>('Doctor', doctorSchema)
