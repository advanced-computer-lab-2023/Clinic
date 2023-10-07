import mongoose from 'mongoose'
import { DoctorStatus } from '../types/doctor.types'

const Schema = mongoose.Schema

const doctorSchema = new Schema(
  {
    username: { type: String, required: false, unique: true },
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

export type DoctorDocument = mongoose.InferSchemaType<typeof doctorSchema>

export const DoctorModel = mongoose.model('Doctor', doctorSchema)
